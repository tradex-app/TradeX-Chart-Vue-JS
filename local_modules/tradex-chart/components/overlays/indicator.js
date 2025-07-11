// indicator.js
// Base class for on and off chart indicators

import Overlay from "./overlay"
import { Range } from "../../model/range"
import { limit } from "../../utils/number"
import Colour, { Palette } from "../../utils/colour"
import { isArray, isArrayOfType, isBoolean, isFunction, isInteger, isNumber, isObject, isString, typeOf } from "../../utils/typeChecks"
import { doStructuredClone, cyrb53, diff, idSanitize, isObjectNotEmpty, mergeDeep, uid } from "../../utils/utilities"
import { SHORTNAME, STREAM_UPDATE } from "../../definitions/core"
import { OHLCV } from "../../definitions/chart"
import { WinState } from "../widgets/window"
import { onClickOutside } from "../../utils/DOM"
import { talibAPI, outputPlot } from "../../definitions/talib-api"
import { error } from "../../helpers/messages"
import { dashedPatterns } from "../../definitions/style"
import { provideEventListeners } from "../widgets/components/listeners"
import { configField, dataOldDefault, defaultOutputField, fieldTargetUpdate, populateMetaInputs, validate, validateInputs, validateOutputs } from "../widgets/components/form-elements"

// const plotTypes = {
//   area,
//   bar,
//   channel,
//   line,
// }

const DEFAULT_PERIOD = 5
const OUTPUTEXTRAS = [
  "highLowRange"
]
const HIGHLOWOUTPUT = {
  name: "highLow",
  type: "overlay",
  plot: "highLow",
  hit: false
}
const IGNORE_DEFINITIONS = ["outputLegend", "outputOrder", "render","style"]

const palette = new Palette()
// Context enum
class Context {
  static standard = new Context("standard")
  static subcomponent = new Context("subcomponent")

  constructor(name) {
    this.name = name
  }
}

// enum for indicator state
export class IndicatorState {
  static noData = new IndicatorState("noData")
  static hasData = new IndicatorState("hasData")
  static error = new IndicatorState("error")
  static destroyed = new IndicatorState("destroyed")

  constructor(name) {
    this.name = name
  }
}

export class InputPeriodEnable {

  #enable = true
  #period = DEFAULT_PERIOD

  constructor (enable=true, period=5) {
    this.enable = enable
    this.period = (isInteger(period)) ? period : 5
  }

  set enable(e) { this.#enable = (isBoolean(e)) ? e : true }
  get enable() { return this.#enable }
  set period(p) { this.#period = (isInteger(p)) ? p : 5 }
  get period() { return this.#period }

}

/**
 * Base class for on and off chart indicators
 * @export
 * @class indicator
 */
export default class Indicator extends Overlay {

  static #cnt = 0
  static get cnt() { return ++Indicator.#cnt }
  static get isIndicator() { return true }
  static definition = {
    input: {},
    output: {},
    meta: {
      input: {},
      output: [],
      outputOrder: [],
      outputLegend: {},
      style: {}
    }
  }


  #ID
  #cnt_
  #key
  #name
  #shortName
  #context
  #legendName
  #legendVisibility
  #primaryPane
  #chartPane
  #scaleOverlay
  #plots
  #overlay
  #indicator
  #type = "indicator"
  #TALib
  #range
  #value = [0, 0]
  #newValueCB
  #updateValueCB
  #precision = 2
  #style = {}
  #legendID
  #status = IndicatorState.noData
  #ConfigDialogue
  #palette
  #error = {type: "", msg: "", style: ""}
  #gapFill = true
  // #gaps = new Set()

  definition = doStructuredClone(Indicator.definition)

  colours = [
    palette.colours[8],
    palette.colours[18],
    palette.colours[28],
    palette.colours[38],
    palette.colours[48],
  ]

  constructor (target, xAxis=false, yAxis=false, config, parent, params) {

    super(target, xAxis, yAxis, undefined, parent, params)

    if (!isObject(this.definition)) 
      error(`Indicator: ${this.shortName}`, `does not provide a valid definition`)

    const overlay = params.overlay
    this.#cnt_ = Indicator.cnt
    this.#overlay = overlay
    this.id = overlay?.id || uid(this?.shortName || overlay?.name)
    this.#key = overlay?.key || indicatorHashKey(overlay)
    this.#TALib = this.core.TALib
    this.#range = this.core.range
    this.legendName = overlay?.legendName || overlay?.name || this?.shortName
    this.#legendVisibility = (isBoolean(overlay?.legendVisibility)) ? overlay.legendVisibility : true
    this.#gapFill = (isBoolean(overlay?.gapFill)) ? overlay.gapFill : true
    this.#palette = palette
    this.style = (isObject(overlay?.settings?.style)) ? 
    {...this.constructor.defaultStyle, ...overlay.settings.style} : 
    {...this.constructor.defaultStyle, ...config.style};
    // this.meta
    const cfg = { title: `${this.legendName} Config`, content: "", params: overlay, parent: this }
    this.#ConfigDialogue = this.core.WidgetsG.insert("ConfigDialogue", cfg)
    switch(overlay.settings?.context) {
      case "subcomponent": this.#context = Context.subcomponent;
      case "standard":
      default: this.#context = Context.standard;
    }

    // return new Proxy(this, {
    //   get (target, key) {
    //     const value = Reflect.get(target, key)
    //     if (typeof value === "function") {
    //       try {
    //         return value.bind(target)
    //       }
    //       catch (e) {
    //         target.core.error(`Error: ${target.name} ${key}()`)
    //       }
    //     }
    //     return target[key]
    //   }
    // })
  }

  get id() { return this.#ID || `${this.core.ID}-${this.chartPaneID}-${this.shortName}-${this.#cnt_}`}
  set id(id) { this.#ID = idSanitize(new String(id)) }
  get key() { return this.#key }
  get version() { return `${this.constructor?.version}` }
  get context() { return this.#context }
  get chartPane() { return this.core.ChartPanes.get(this.chartPaneID) }
  get chartPaneID() { return this.params.overlay.paneID }
  get primaryPane() { return this.#primaryPane || this.constructor.primaryPane }
  set primaryPane(c) { this.#primaryPane = c }
  get scaleOverlay() { return this.#scaleOverlay }
  set scaleOverlay(o) { this.#scaleOverlay = o }
  get plots() { return this.#plots }
  set plots(p) { this.#plots = p }
  get Timeline() { return this.core.Timeline }
  get scale() { return this.parent.scale }
  get type() { return this.#type }
  get overlay() { return this.#overlay }
  get legend() { return this.chart.legend.list[this.#legendID] }
  get legendID() { return this.#legendID }
  get legendName() { return this.#legendName || this.overlay?.name || this?.shortName || this.#ID }
  set legendName(n) { this.setLegendName(n) }
  set legendVisibility(v) { this.setLegendVisibility(v) }
  get indicator() { return this.#indicator }
  get TALib() { return this.#TALib }
  get range() { return this.core.range }
  set setNewValue(cb) { this.#newValueCB = cb }
  set setUpdateValue(cb) { this.#updateValueCB = cb }
  set precision(p) { this.#precision = p }
  get precision() { return this.#precision }
  set style(s) { if (isObject(s)) this.#style = s }
  get style() { return this.#style }
  set position(p) { this.target.setPosition(p[0], p[1]) }
  get isIndicator() { return Indicator.isIndicator }
  get isPrimary() { return this.chart.isPrimary }
  set status(s) { if (s instanceof IndicatorState) this.#status = s }
  get status() { return this.#status }
  set error(e) { this.setError(e) }
  get error() { return this.#error }
  get gapFill() { return this.#gapFill }
  set gapFill(g) { this.#gapFill = !!g }
  get configDialogue() { return this.#ConfigDialogue }


  /**
   * process candle value
   * @type {Array<number>} data - [timestamp, open, high, low, close, volume]
   */
  set value(data) {
    // round time to nearest current time unit
    const tfms = this.core.timeData.timeFrameMS
    let roundedTime = Math.floor(new Date(data[OHLCV.t]) / tfms) * tfms
    data[OHLCV.t] = roundedTime

    if (this.#value[OHLCV.t] !== data[OHLCV.t]) {
      this.#value[OHLCV.t] = data[OHLCV.t]
      this.#newValueCB(data)
    }
    else {
      this.#updateValueCB(data)
    }
  }
  
  /**
   * @type {Array<number>}
   */
  get value() {
    return this.#value
  }

  setError(e) {
    if (this.#status === IndicatorState.destroyed) return false
    if (!isObject(e) &&
        !isString(e?.type) &&
        !isString(e?.msg)) return false
    const err = {...e}
    err.indicator = this
    this.#error = e
    this.#status = IndicatorState.error
    this.emit("indicator_error", err)
    this.core.warn(`WARNING: Indicator: ${this.shortName} ID: ${this.id} ${err.msg}`)
  }

  /**
   * specify Legend name
   * @param {String} name 
   */
  setLegendName(name) {
    this.#legendName = (isString(name)) ? name : this.overlay?.name || this.shortName || this.#ID
    this.chart.legend.modify(this.#legendID, { legendName: this.#legendName })
  }

  /**
   * set indicator visibility on chart
   * @param {Boolean} v - true: visible, false: hidden
   */
  setLegendVisibility(v) {
    this.#legendVisibility = !!v
    this.chart.legend.modify(this.#legendID, { legendVisibility: !!v })
  }

  setDefinitionValue(d,v) {
    let defs = Object.keys(this.definition.input)
    if (defs.includes(d)) {
      this.definition.input[d] = v * 1
      return "input"
    }
    defs = Object.keys(this.style)
    if (defs.includes(d)) {
      this.style[d] = v
      return "style"
    }
  }

  init(api) {
    const overlay = this.params.overlay

    this.defineIndicator(overlay, api)
    // calculate back history if missing
    this.calcIndicatorHistory()
    // enable processing of price stream
    this.setNewValue = (value) => { this.newValue(value) }
    this.setUpdateValue = (value) => { this.updateValue(value) }

    if (this.#context === Context.standard) {
      // indicator legend
      this.addLegend()
      // config dialogue
      this.#ConfigDialogue.start()

      this.eventsListen()
      this.setRefresh()
      // this.draw()
    }
  }

  destroy(state=true) {
    if ( this.#status === IndicatorState.destroyed) return
    // has this been invoked from removeIndicator() ?
    // const chartPane = this.core.ChartPanes.get(this.chartPaneID)
    if ( !this.chartPane.indicatorDeleteList[this.id] ) {
      this.core.warn(`Cannot "destroy()": ${this.id} !!! Use "indicator.remove()" or "chart.removeIndicator()" instead.`)
      return
    }
    // terminate listeners
    this.core.hub.expunge(this)

    this.chart.legend.remove(this.#legendID)

    // remove overlay from parent chart pane's graph
    this.clear()
    this.core.MainPane.draw(undefined, true)
    this.chartPane.graph.removeOverlay(this.id)

    // execute parent class
    // delete data
    // remove listeners
    super.destroy()
    // remove indicator state data
    if (!!state)
      this.core.state.removeIndicator(this.id)

    this.#status = IndicatorState.destroyed
  }

  /**
   * Remove indicator from chart pane
   */
  remove() {
    this.core.log(`Deleting indicator: ${this.id} from: ${this.chartPaneID}`)

    // Should the chart pane be removed also?
    if (this.chart.type === "primaryPane" ||
        Object.keys(this.chart.indicators).length > 1) 
    {
      this.emit(`${this.chartPaneID}_removeIndicator`, {id: this.id, paneID: this.chartPaneID})
    }
    // Yes!
    else
      this.chart.remove()
  }

  /**
   * @typedef {Object} snapshot
   * @property {String} id 
   * @property {String} key - hashed key
   * @property {String} name - display name
   * @property {String} type - indicator type (short name)
   * @property {Array} data - indicator data
   * @property {Object} settings - indicator definition, input, output, style
   */
  /**
   * Return a snapshot of values
   * @returns {snapshot}
   */
  snapshot() {
    return {
      id: this.id,
      key: this.key,
      name: this.params.overlay.name,
      type: this.shortName,
      data: this.data,
      settings: this.definition
    }
  }

  /**
   * build synthetic indicator data from sources other than TALib
   * @param {function} fn - function to fill target with data
   * @param {array} target 
   */
  dataProxy(fn, target=[]) {
    const range = this.range
    const state = this.core.state
    const output = this.definition.meta.output
    const data = []
    const dummy = new Array(output.length + 1)
          dummy.fill(0)
      let length = range.dataLength
    for (let i=0; i <= length; i++) {
      dummy[0] = range.data[i][0]
      data[i] = Array.from(dummy)
    }

    if (isFunction(fn)) fn(data, state, range)

    // this.core.on("state_tradeAdded")

    this.data.length = 0
    for (let d of data) {
      this.data.push(d)
    }
  }

  /**
   * set or get indicator visibility
   * @param {boolean} [v] - visible
   * @returns {boolean}
   */
  visible(v) {
    if (isBoolean(v)) {
      this.emit(`${this.chartPaneID}_visibleIndicator`, {id: this.id, paneID: this.chartPaneID, visible: v})
      this.chartPane.indicators[this.id].layer.visible = v
      this.draw()
    }
    return this.chartPane.indicators[this.id].layer.visible
  }

  /**
   * set or get indicator settings
   * @param {Object} [s] - settings
   * @returns {Object}
   */
  settings(s) {
    if (isObject(s)) {
      if (isObject(s?.config)) this.params.overlay.settings = 
        mergeDeep(this.params.overlay.settings, s.config)
      if (isObject(s?.style)) this.style =
        mergeDeep(this.style, s.style)
      this.draw()
    }
    return {
      config: this.params.overlay.settings,
      style: this.style,
      defaultStyle: this?.defaultStyle,
      plots: this.plots,
      precision: this.precision,
      definition: this.definition,
    }
  }

  eventsListen() {
    this.on(STREAM_UPDATE, this.onStreamUpdate, this)
    this.on(`window_opened_${this.id}`, this.onConfigDialogueOpen, this)
    this.on(`window_closed_${this.id}`, this.onConfigDialogueCancel, this)
    this.on(`window_submit_${this.id}`, this.onConfigDialogueSubmit, this)
    this.on(`window_cancel_${this.id}`, this.onConfigDialogueCancel, this)
    this.on(`window_default_${this.id}`, this.onConfigDialogueDefault, this)
  }

  on(topic, handler, context=this) {
    this.core.on(topic, handler, context)
  }

  off(topic, handler, context=this) {
    this.core.off(topic, handler, context)
  }

  emit(topic, data) {
    this.core.emit(topic, data)
  }

  onStreamNewValue(value) {
    // this.value = value
    // console.log("onStreamNewValue(value):",value)
  }

  /**
   * process new candle stream value
   * @param {Array} candle - [timestamp, open, high, low, close, volume]
   */
  onStreamUpdate(candle) {
    // console.log("onStreamUpdate(candle):", candle)
    this.value = candle
  }

  /**
   * execute legend action
   * @param {Object} e - event
   */
  onLegendAction(e) {

    const action = this.chart.legend.onPointerClick(e.currentTarget)

    switch(action.icon) {
      case "up": return;
      case "down": return;
      case "visible": this.onVisibility(action); return;
      case "notVisible": this.onVisibility(action); return;
      case "remove": this.remove(); return;
      case "config": this.invokeSettings(); return;
      default: return;
    }
  }

  /**
   * toggle indicator visibility
   * @param {Object} action - 
   */
  onVisibility(action) {
    this.setRefresh()
    this.visible(!this.visible())
    action.parent.classList.toggle("visible")
    action.parent.classList.toggle("notvisible")
  }

//--- Config Settings ---

  onConfigDialogueOpen(d) {
    // console.log(`${this.id} Config Open`)

    if (this.#ConfigDialogue.state === WinState.opened) return

    this.#ConfigDialogue.setOpen()
    // store current value as the old value
    const fields = this.#ConfigDialogue.contentFields

    for (let field in fields) {
      for (let f of fields[field]) {
        if (f.classList.contains("subject")) {
          if (f.getAttribute("data-oldval") !== f.value) {
          f.setAttribute("data-oldval", f.value)
        }
      }
    }
  }
  }

  onConfigDialogueSubmit(d) {
    // console.log(`${this.id} Config Submit`)

    this.#ConfigDialogue.setClose()
    let r, calc = false;
    const fields = this.#ConfigDialogue.contentFields

    for (let field in fields) {
      for (let f of fields[field]) {
        if (f.classList.contains("subject")) {
          f.setAttribute("data-oldval", f.value)
          r = this.setDefinitionValue(f.id, f.value)
          calc = calc || (r == "input")
        }
      }
    }
    // clear indicator and recalculate
    if (calc) {
      this.clear()
      this.overlay.data.length = 0
      this.calcIndicatorHistory()
    }
    this.setRefresh()
    this.draw()
    this.core.refresh()
  }

  onConfigDialogueCancel(d) {

    this.#ConfigDialogue.setClose()
    const fields = this.#ConfigDialogue.contentFields

    for (let field in fields) {
      for (let f of fields[field]) {
        if (f.classList.contains("subject")) {
          f.value = f.getAttribute("data-oldval")
        }
      }
    }
    this.setRefresh()
    this.draw()

    // console.log(`${this.id} Config Cancel`)
  }

  onConfigDialogueDefault(d) {
    // console.log(`${this.id} Config Default`)

    const fields = this.#ConfigDialogue.contentFields

    for (let field in fields) {
      for (let f of fields[field]) {
        if (f.classList.contains("subject")) {
          let dataDefault = f.getAttribute("data-default")
          f.value = dataDefault
          this.style[f.id] = dataDefault
        }
      }
    }
    this.calcIndicatorHistory()
    this.setRefresh()
    this.draw()
  }

  /**
   * invoke indicator settings callback, user defined or default
   * @param {Object} c - {fn: function, own: boolean}, own flag will bypass default action
   * @returns {boolean} - success or failure
   */
  invokeSettings(c={}) {
    let r;
    // execute provided settings function
    if (isFunction(c?.fn)) {
      r = c.fn(this)
      // execute the default?
      if (c?.own) return r
    }
    // execute configured settings function
    else if (isFunction(this.core.config.callbacks?.indicatorSettings?.fn)) {
      r = this.core.config.callbacks.indicatorSettings.fn(this)
      // execute the default?
      if (this.core.config.callbacks?.indicatorSettings?.own) return r
    }
    // execute default settings action
    this.core.log(`invokeSettings: ${this.id}`)
    // console.log(`invokeSettings: ${this.id}`, r)

    const cd = this.#ConfigDialogue
    if (cd.update) {
      // does indicator provide function to build tabbed config object?
      if (!isFunction(this.configInputs)) {
        this.core.error(`ERROR: Indicator ${this.name} does not provide configInputs() required for the settings dialogue`)
        return false
      }
      // build the config dialogue
      const configTabs = this.configInputs()
      const {html, modifiers} = cd.configBuild(configTabs)
      const title = `${this.shortName} Config`
      cd.setTitle(title)
      cd.setContent(html, modifiers)
      cd.update = false
    }
    if (cd.state.name === "closed" ) cd.open()
    else cd.setOpen()
    return true
  }

  // entry, id, label, type, value, default, placeholder, class, max, min, step, onchange, disabled, visible, description

  configInputs() {
    const name = this.name || this.shortName || this.id
    const noConfig = `Indicator ${name} is not configurable.`
    const noTabs = { "No Config": {tab1: noConfig} }
      let tabs = {};
      let meta = this?.definition?.meta

    if (!isObject(meta) &&
        !isObject(this?.style) &&
        !isObject(this?.definition?.input)) 
      return noTabs

    // process other tabs
    for (let tab in meta) {
      if (IGNORE_DEFINITIONS.includes(tab)) continue

      tabs[tab] = meta[tab]
    }
    // if there are no tabs return no config message
    if (Object.keys(tabs).length == 0)
      tabs = noTabs
    // ensure all tab fields provide data-oldval, data-default
    else {
      for (let tab in tabs) {
        dataOldDefault(tabs[tab])
      }
    }

    return tabs
  }

  /**
   * Updates indicator meta output value with dialogue value
   * @returns {object}
   */
  fieldEventChange() {
    let style = this.definition.meta.style
    return {
      event: "change", 
      fn: (e)=>{
        // this.definition.meta.output[e.target.id] = e.target.value
        fieldTargetUpdate(e.target.id, e.target.value, style)
        this.setRefresh()
        this.draw()
      }
    }
  }


  //--- building the indicator

  /**
   * validate indicator inputs and outputs against expected types and values
   * @param {Object} settings - indicator inputs
   * @param {Object} api - predefined parameters
   * @memberof indicator
   */
  defineIndicator(settings, api) {

    let input = this.retrieveInput(settings)
    api = (isObject(api)) ? api : {outputs: [], options: []}

    const definition = doStructuredClone(Indicator.definition)
    if (!isObject(this.definition)) 
      this.definition = definition

    this.definition = mergeDeep(definition, this.definition)

    // indicator definition sanity check 
    let d = this.definition;
    let dm = d.meta;
    let oo = [];
    let out = talibAPI?.[this.libName]?.outputs || [];
    d.input = (!isObject(d.input)) ? input : {...d.input, ...input}
    d.output = (!isObject(d.output)) ? {} : d.output
    dm = (!isObject(dm)) ? definition.meta : dm
    dm.input = (!isObject(dm.input)) ? {} : dm.input
    dm.output = (!isArray(dm.output) || !dm.output.length) ? out : [...out, ...dm.output];
    dm.outputOrder = (!isArray(dm.outputOrder)) ? [] : dm.outputOrder
    dm.outputLegend = (!isObject(dm.outputLegend)) ? {} : dm.outputLegend

    // style ---------------
    if (!isObjectNotEmpty(dm.style))
        dm.style = this.style || {}

    validateInputs(d, input, api)
    populateMetaInputs(d)
    validateOutputs(d, api, oo)
    this.buildOutputOrder(dm, oo, OUTPUTEXTRAS)
    this.buildOutputLegends(d)
    this.buildConfigOutputTab(dm)

  } // end of define indicator

  retrieveInput(settings) {
    if (isObject(settings?.input)) return settings.input
    else if (isObject(settings?.settings?.input)) return settings.settings.input
    else return {}
  }

  /**
   * meta output render order
   * merge output keys with output order
   * remove redundant keys and preserve order
   * @param {object} dm - this.definition.meta
   * @param {array} oo - output order derived from API output definition
   * @param {Array} extras
   */
  buildOutputOrder(dm, oo, extras) {
    let u = [...new Set([...dm.outputOrder, ...oo])]
    let del = diff(u, oo)
    for (let x of del) {
      if (extras.includes(x)) continue
      let idx = u.indexOf(x)
      u.splice(idx, 1)
    }
    dm.outputOrder = u
  }

  buildOutputLegends(d) {
    let dm = d.meta
    let k = Object.keys(d.output)
    for (let [k,v] of Object.entries(dm.outputLegend)) {
      if (!isObject(v)) {
        dm.outputLegend[k] = {}
      }
      if (!isString(dm.outputLegend[k].labelStr)) {
        dm.outputLegend[k].label = false
        dm.outputLegend[k].labelStr = ""
      }
      if (!isBoolean(dm.outputLegend[k].label))
        dm.outputLegend[k].label = false
      if (!isBoolean(dm.outputLegend[k].value))
        dm.outputLegend[k].value = false
    }
  }

  /**
   * Outputs Tab add any missing requirements
   * @param {object} dm - this.definition.meta
   */
  buildConfigOutputTab(dm) {
    // cleam up style
    for (let i in dm.style) {
      if (typeof dm.style[i] !== "object")
        delete dm.style[i]
    }

    // meta output - add required data for relevant form fileds
    for (let x = 0; x < dm.output.length; x++) {
      let o = dm.output[x]
      let t = plotFunction(o?.plot)
      switch(t) {
        case "renderLine": 
          o.style = this.defaultMetaStyleLine(o, x, dm.style)
          break;
        case "histogram": 
          o.style = this.defaultMetaStyleHistogram(o, x, dm.style)
          break;
        case "highLow": return "highLow"
        default: break;
      }
    }
  }


  /**
   * 
   * @param {object} o - style object
   * @param {number} x - style entry (field) number
   * @param {object} style - style entry object
   * @returns {object}
   */
  defaultMetaStyleLine(o, x, style) {
    let value, params;
    let fns = {
      change: this.fieldEventChange(),
      provideInputColour: this.#ConfigDialogue.provideInputColor
    }
    o.name = (!o?.name) ? "output" : o.name

    if (!isObject(style?.[o.name]))
      style[o.name] = {}
    
    // is colour valid?
    let c = new Colour(style[o.name]?.colour?.value)
    if (!c.isValid) {
      let k = this.colours.length
          value = (x <= k) ? this.colours[x] : this.colours[k%x]
    }
    else {
      value = c.value.hexa
    }
    style[o.name].colour = this.defaultOutputField(`${o.name}Colour`, `${o.name} Colour`, value, "color", fns)

    // is width valid?
    if (!isNumber(style[o.name]?.width?.value))
      value = 1
    else
      value = style[o.name]?.width.value

    style[o.name].width = this.defaultOutputField(`${o.name}Width`, `${o.name} Width`, value, "number", 0)

    if ("dash" in style[o.name] && (!!style[o.name].dash)) {
      value = style[o.name]?.dash?.value
      style[o.name].dash = this.defaultOutputField(`${o.name}dash`, `${o.name} Dash`, value, "dash", undefined, undefined, )
    }

    // style[o.name].fillS = string
    // style[o.name].fillStyle = #RBBA
    return style[o.name]
  }

  defaultMetaStyleHistogram(o, x, style) {
    let value;
    let fns = {
      change: this.fieldEventChange(),
      provideInputColour: this.#ConfigDialogue.provideInputColor
    }
    o.name = (!o?.name) ? "output" : o.name

    if (!isObject(style?.[o.name]))
      style[o.name] = {}

    // style[o.name]?.dnFill?.value
    // style[o.name]?.dnStroke?.value

    // is colour valid?
    let c = new Colour(style[o.name]?.dnFill?.value)
    if (!c.isValid) {
      value = "#f00"
    }
    else {
      value = c.value.hexa
    }
    style[o.name].dnFill = this.defaultOutputField(`${o.name}ColourDn`, `${o.name} Colour Dn`, value, "color", fns)
    style[o.name].dnStroke = style[o.name].dnFill

    // is colour valid?
    c = new Colour(style[o.name]?.upFill?.value)
    if (!c.isValid) {
      value = "#0f0"
    }
    else {
      value = c.value.hexa
    }
    style[o.name].upFill = this.defaultOutputField(`${o.name}ColourUp`, `${o.name} Colour Up`, value, "color", fns)
    style[o.name].upStroke = style[o.name].upFill

    return style[o.name]
    // return "histogram"
  }

  defaultOutputField(id, label, value, type, min, max, defaultValue) {

    let c, fn, listeners, options;
    let change = this.fieldEventChange()

    switch(type) {
      case "number":
        listeners = [change]
        fn = (el) => {
          provideEventListeners(`#${id}`, listeners)(el)
        }
        break;

      case "color":
        listeners = [change, over, out]
        fn = (el) => {
          this.#ConfigDialogue.provideInputColor(el, `#${id}`)
          provideEventListeners(`#${id}`, listeners)(el)
        }
        type = "text"
        break;

      case "dash":
        listeners = [change]
        fn = (el) => {
          provideEventListeners(`#${id}`, listeners)(el)
        }
        type = "select"
        let patterns = {}
        for (let d in dashedPatterns) {
          patterns[d] = dashedPatterns[d].toString()
        }
        options = patterns
        break;
    }


    return configField(id, label, type, value, value, min, max, fn, label, options)
  }

  defaultColour() {
    return "#fff"
  }

  addLegend() {
    let legend = {
      id: this.id,
      title: this.legendName,
      visible: this.#legendVisibility,
      type: "indicator",
      parent: this,
      source: this.legendInputs.bind(this)
    }
    this.#legendID = this.chart.legend.add(legend)
  }

  /**
   * return index from cursor position and colours
   * @param {Array} [pos=this.chart.cursorPos]
   * @returns {Object}  
   * @memberof indicator
   */
  legendInputs(pos=this.chart.cursorPos) {
    if (this.overlay.data.length == 0) return false

    const labels = []
    const colours = []
    const inputs = {}
    const index = this.Timeline.xPos2Index(pos[0])
    const len = this.overlay.data.length
    const order = this.definition.meta.outputOrder
    const legend = this.definition.meta.outputLegend

    let c = index  - (this.range.data.length - len)
    let l = limit(len - 1, 0, Infinity)
        c = limit(c, 0, l)

    let i = 0
    for (let o of this.definition.meta.output) {
      let entry = this.overlay.data[c]
      if (o.type == "overlay" ||
          !isArray(entry) ||
          entry.length == 0
          ) continue

      labels[i] = false
      inputs[o.name] = this.scale.nicePrice(this.overlay.data[c][i+1])

      if (o.plot == "histogram") {
        if (this.overlay.data[c][i+1] < 0)
          colours[i] = this.definition.meta.style?.[o.name].dnStroke
        else
          colours[i] = this.definition.meta.style?.[o.name].upStroke
      }
      else 
        colours[i] = this.definition.meta.style?.[o.name]?.colour?.value || "#ccc"
      i++
    }

    return {inputs, colours, labels}
  }

  indicatorInput(start, end) {
    let gaps = this.core.state.gaps.list
    let raw, val;
    let input = {
      inReal: [],
      open: [],
      high: [],
      low: [],
      close: [],
      volume: []
    }

    do {
      raw = this.range.value(start)
      if (this.#gapFill && `${raw[0]}` in gaps) {
        // gap entry null values
        val = gaps[`${raw[0]}`]
        // this.#gaps.add(raw[0])
      }
      else val = raw

      input.inReal.push(val[OHLCV.c])
      input.open.push(val[OHLCV.o])
      input.high.push(val[OHLCV.h])
      input.low.push(val[OHLCV.l])
      input.close.push(val[OHLCV.c])
      input.volume.push(val[OHLCV.v])
    }
    while (start++ < end)
    return input
  }

  regeneratePlots (params) {
    return params.map((_, index) => {
      const num = index + 1
      return {
        key: `${this.shortName}${num}`, 
        title: `${this.shortName}${num}: `, 
        type: 'line'
      }
    })
  }

  getTimePeriod() {
    let d = 0;
    let def = this.definition.input
    let m = (!!this.constructor?.timePeriodMultiplier) ? 2 : 1

    if ("timePeriod" in def)
      d = def.timePeriod * m
    else {
      for (let i in def) {
        if (isInteger(def[i]) && def[i] > d)
        d = def[i]
      }
      d *= m
    }
    return d
  }

  TALibParams() {
    let end = this.range.dataLength
    let step = this.getTimePeriod()
    let start = end - step //+ 1
    let input = this.indicatorInput(start, end)
    let hasNull = input.inReal.find(element => element === null)
    if (hasNull) return false
    else return { timePeriod: step, ...input }
  }

  formatValue(entry) {
    let v = []
    let i = 0
    for (let o in this.definition.output) {
      v[i++] = entry[o][0]
    }
    return v
  }

  noCalc(indicator, range=this.range) {
    return this.chart.status == 'destroyed' ||
          !this.core.TALibReady ||
          !isString(indicator) ||
          !(indicator in this.TALib) ||
          !isObject(range) ||
          range.dataLength < this.definition.input.timePeriod 
  }

  noCalcCustom (indicator, range=this.range) {
    return this.chart.status == 'destroyed' ||
          !this.core.TALibReady ||
          !isFunction(indicator) ||
          !isObject(range) ||
          range.dataLength < this.definition.input.timePeriod 
  }

  /**
 * Calculate indicator values for chart history - partial or entire
 * @param {string|function} indicator - the TALib function to call
 * @param {object} params - parameters for the TALib function
 * @param {Range} range - range instance or definition
 * @param {Array.<Number>} [update] - timestamps of updated price history
 * @returns {Promise} - success or failure - array|boolean
 */
  calcIndicator (indicator, params={}, range, update) {
    return new Promise( (resolve, reject) => {
      let indicatorFn = this.TALib[String(indicator)]
      if (!this.noCalcCustom(indicator))
        indicatorFn = indicator
      else if (!this.noCalc(indicator, range))
        indicatorFn = this.TALib[indicator]
      else resolve(false)

      // get the period 
      let d = this.getTimePeriod()
      // params.timePeriod = params.timePeriod || this.definition.input.timePeriod || DEFAULT_PERIOD
      let start, end;
      let p = d
      let t = p + (params?.padding || 0)
      let od = this.overlay.data
  
      // is it a Range instance?
      if (range instanceof Range) {
        start = 0
        end = range.dataLength - t + 1
      }
      else if ( isObject(range) ) {
        start = range?.indexStart || this.Timeline.t2Index(range?.tsStart || 0) || 0
        end = range?.indexEnd || this.Timeline.t2Index(range?.tsEnd) || range.dataLength - t + 1
        end - t
      }
      else resolve(false)
  
      // check if a full or only partial calculation is required
      if (!isArray(od)) resolve(false)
      // full calculation required
      else if (od.length == 0) { }
      // partial calculation required
      else if (od.length + t !== range.dataLength) {
        // new data in the past?
        if (od[0][0] > range.value(t)[0]) {
          start = 0
          end = range.getTimeIndex(od[0][0]) - t
          end = limit(end, t, range.dataLength - 1)
        }
        // new data in the future ?
        else if (od[ od.length - 1 ][0] < range.value( range.dataLength - 1 )[0]) {
          start = od.length - 1 + t
          start = limit(start, 0, range.dataLength)
          end = range.dataLength - 1
        }
        // something is wrong
        else resolve(false)
      }
      // updated span of price history?
      else if (isArrayOfType(update, "integer")) {
        start = this.Timeline.t2Index(update[0])
        end = this.Timeline.t2Index(update[update.length-1]) - t
        if (end - start < t)
          start = (start - t < 0) ? 0 : start - t
      }
      // up to date, no need to calculate
      else resolve(false)
  
      // if not enough data for calculation fail
      if ( end < t ) {
        this.setError( {type: "noData", msg: "Insufficient input data"} )
        resolve(false)
      }
      if ( end - start < t ) {
        start -= (t + p) - (end - start)
      }
  
      let data = [];
      let entry, input, value;
  
      while (start < end) {
        // fetch the data required to calculate the indicator
        input = this.indicatorInput(start, start + t)
        params = {...params, ...input}
        // let hasNull = params.inReal.find(element => element === null)
        // if (hasNull) return
  
        entry = indicatorFn(params)
        value = this.formatValue(entry)
        // store entry with timestamp
        data.push([range.value(start + p - 1)[0], ...value])
        start++
      }
      // this.#gaps = new Set([...this.#gaps].sort())
      resolve(data)
    })
  }

  /**
   * calculate back history if missing
   * @param {Array.<Number>} update - timestamps of updated price history
   */
  calcIndicatorHistory (update) {
    const calc = () => {
      let od = this.overlay.data
      this.calcIndicator(this.libName, this.definition.input, this.range, update)
      .then( (data) => {
        if (isArray(data)) {
          const d = new Set(data)
          const o = new Set(od)
          let a, p, r = {}, s;
          if (!isArray(od) ||
              od.length == 0 ) {
              this.overlay.data = data
              return
          }
          else if (!data.length) return
          else if (data[0][0] < od[0][0]) {
            // s = new Set([...d, ...o])
            // this.overlay.data = Array.from(s)
            a = data
            p = od
          }
          else if (data[data.length-1][0] > od[od.length-1][0]) {
            // s = new Set([...o, ...d])
            // this.overlay.data = Array.from(s)
            a = od
            p = data
          }
          else{
            // s = new Set([...o, ...d])
            a = od
            p = data
          }
          
          for (let v of a) {
            r[v[0]] = v
          }
          for (let v of p) {
            r[v[0]] = v
          }
          this.overlay.data = Object.values(r)
          this.#status = IndicatorState.hasData
          this.setRefresh()
          this.scale.draw(this.range, true)
        }
      })
    }
    if (this.core.TALibReady) calc()
    else  this.core.talibAwait.push(calc.bind(this))
  } 

  /**
   * Calculate indicator value for current stream candle
   * @param {string|function} indicator - the TALib function to call
   * @param {Object} params - parameters for the TALib function
   * @param {Object} range - Range instance
   * @returns {array|boolean} - indicator data entry
   */
  calcIndicatorStream (indicator, params, range=this.range) {

    if (!(range instanceof Range)) return false

    let indicatorFn;
    if (!this.noCalcCustom(indicator))
      indicatorFn = indicator
    else if (!this.noCalc(indicator, range))
      indicatorFn = this.TALib[indicator]
    else return false

    let entry = indicatorFn(params)
    let time = range.value()[0]
    let value = this.formatValue(entry)

    return [time, ...value]
  }

  /**
   * process stream and create new indicator data entry
   * @param {Array} value - current stream candle 
   * @memberof indicator
   */
  newValue (value) {
    this.#setValue(
      (v) => this.overlay.data.push(v)
    )
  }

  /**
   * process stream and update current (last) indicator data entry
   * @param {Array} value - current stream candle 
   * @memberof indicator
   */
  updateValue (value) {
    this.#setValue(
      (v) => {
        let l = this.overlay.data.length - 1;
        this.overlay.data[l] = v 
      }
    )

  }

  #setValue(fn) {
    let p = this.TALibParams()
    if (!p) return false
// console.log(p)
    let v = this.calcIndicatorStream(this.libName, p)
    if (!v) return false
// console.log(v)
    fn(v)
    this.#status = IndicatorState.hasData
    this.target.setPosition(this.core.scrollPos, 0)
    this.doDraw = true
    this.draw(this.range)
  }

  /**
   * 
   * @param {number} j - range length
   * @param {number} k - range index start
   * @param {number} p - plot index, the output to plot
   * @param {string} r - render action
   * @param {object} s - plot styling
   */
  plotIt(j, k, p, r, s) {
    const data = this.overlay.data
    const width = this.xAxis.candleW
    const zero = this.yAxis.yPos(0)
    const plot = { w: width, zero }
    const opts = {}

    let plots = []

    while(j) {
      if (k < 0 || 
          k >= data.length ||
          !isArray(data[k])
          ) {
        plots.push({x: null, y: null})
      }
      else {
        plot.x = this.xAxis.xPos(data[k][0])
        plot.y = this.yAxis.yPos(data[k][p])
        plots.push({...plot})
      }
      k++
      j--
    }

    for (let key in s) {
      if (!!s[key]?.value)
        opts[key] = s[key].value
    }

    this.plot(plots, r, opts)
  }

  canIndicatorDraw() {
    return !(this.overlay.data.length < 2 ||
            !this.mustUpdate() ||
            !this.yAxis ||
            !this.state.isActive)
  }

  draw(range=this.range) {
    if (!this.canIndicatorDraw()) return

    this.clear()
    const data = this.overlay.data
    const offset = this.xAxis.smoothScrollOffset || 0
    const meta = this.definition.meta
    const plots = {}

    // account for "missing" entries because of indicator calculation
    let o = this.Timeline.rangeScrollOffset
    let d = range.data.length - data.length
    let c = range.indexStart - d - 2
    let i = range.Length + (o * 2) + 2
    let x = 1

    if (!meta.output.length) 
      return super.updated()

    for (let p of meta.output) {
      let r = plotFunction(p.plot)
      // valid plot function
      if (r) plots[p?.name] = {x: x++, r}
    }

    // plot order
    // drawn in reverse order, bottom to top
    let oo = (meta?.outputOrder.length > 0) ? 
      meta.outputOrder : 
      Object.keys(plots)
    let q = oo.reverse()
    for (let p of q) {
      let style = this.formatStyle(this.definition.meta.style[p], p)
      this.plotIt(i, c, plots[p].x, plots[p].r, style)
    }

    this.target.viewport.render();

    super.updated()
  }

  formatStyle(style, plot) {
    let e, s = {};
    for (let entry in style) {
      e = entry.replace(plot, "").toLowerCase()

      switch(e) {
        case "colour": e = "stroke"; break;
      }
      
      s[e] = style[entry]
    }
    return s
  }

  updated() {
    this.setRefresh()
    super.updated()
  }

}
// end of class Indicator



function plotFunction(t) {
  switch(t) {
    case "line": 
    case "line_dash":
    case "limit_lower":
    case "limit_upper":
      return "renderLine"
    case "histogram": return "histogram"
    case "highLowRange": return "highLowRange"
    default: return false
  }
}

const over = {
  event: "pointerover",
  fn: (e) => {
    e.target.style.border = "1px solid #f00;"
  }
}
const out = {
  event: "pointerout",
  fn: (e) => {
    e.target.style.border = "none;"
  }
}

export function indicatorHashKey(params) {
  const objStr = JSON.stringify(params)
  const hash = cyrb53(objStr)
  return `${SHORTNAME}_Indicator_${hash}`
}
