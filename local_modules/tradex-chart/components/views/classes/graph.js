// graph.js
// class

import DOM from "../../../utils/DOM"
import { doStructuredClone, xMap } from '../../../utils/utilities'
import { isArray, isBoolean, isFunction, isNumber, isObject, isString } from '../../../utils/typeChecks'
import CEL from "../../primitives/canvas"
import Overlays from "../../overlays"
import Overlay from "../../overlays/overlay"

import grid from "../../overlays/chart-grid"
import cursor from "../../overlays/chart-cursor"
const defaultOverlays = [
  ["grid", {class: grid, fixed: true}],
  ["cursor", {class: cursor, fixed: true}]
]

import { BUFFERSIZE } from "../../../definitions/chart"

export default class Graph {

  #core
  #config
  #theme
  #parent
  #chartPane
  #viewport
  #overlays

  #elParent
  #elViewport
  #elCanvas

  #layerWidth


  /**
   * Creates an instance of Graph.
   * @param {object} parent - class or function that instantiates Graph, provides application pointers
   * @param {HTMLElement} elViewport - HTML element that will host the Graph canvas element
   * @param {array} overlays - array of Overlay objects
   * @param {boolean} [node=false]
   * @memberof Graph
   */
  constructor(parent, elViewport, overlays, node=false) {

    this.#parent = parent
    this.#core = parent.core
    this.#config = this.core.config
    this.#theme = this.core.theme
    this.#chartPane = this.getChartPane()
    this.#elParent = this.#parent.element
    this.#elViewport = elViewport
    
    // create graph viewport with overlays
    this.createViewport(overlays, node)
  }

  get parent() { return this.#parent }
  get chart() { return (this.#chartPane) }
  get core() { return this.#core }
  get config() { return this.#config }
  get width() { return this.#elParent.width }
  get height() { return this.#elParent.height }
  get dimensions() { return this.#elParent.dimensions }
  set layerWidth(w) { this.#layerWidth = w || this.#elParent.width }
  get layerWidth() { return this.#layerWidth }
  get stateMachine() { return this.#parent.stateMachine }
  get state() { return this.#core.getState() }
  get data() { return this.#core.chartData }
  get range() { return this.#core.range }
  get stream() { return this.#core.stream }
  get Timeline() { return this.#core.Timeline }
  get xAxis() { return this.#core.Timeline.xAxis }
  get Scale() { return this.#parent.scale }
  get yAxis() { return this.#parent.scale.yAxis }
  get viewport() { return this.#viewport }
  get canvas() { return this.#elCanvas }
  get overlays() { return this.#overlays }
  get elViewport() { return this.#elViewport }

  destroy() {
    this.#overlays.destroy()
    this.#viewport.destroy()
  }

  /**
   * set dimensions
   * @param {number} w - viewport width
   * @param {number} h - viewport height
   * @param {number} lw - layer width, independent width to allow for scroll buffer
   * @memberof graph
   */
  setSize(w, h, lw) {
    const oList = this.#overlays.list

    this.#viewport.setSize(w, h)

    for (let [key, overlay] of oList) {
      overlay.instance.setSize(lw, h)
    }
    // must redraw because resizing canvas clears it
    this.draw()
    this.render()
  }

  getChartPane() {
    let chartPane = this.parent

    while (!!chartPane) {
      if (chartPane?.type !== "primaryPane" && chartPane?.type !== "secondaryPane")
        chartPane = chartPane?.parent
      else 
        break
      if (chartPane === undefined)
        break
    }
    return chartPane
  }

  /**
   * create canvas viewport and appends it to the container element
   *
   * @param {array} [overlays=[]]
   * @param {boolean} [node=false]
   * @memberof Graph
   */
  createViewport(overlays=[], node=false) {

    // overlays = (overlays.length == 0) ? doStructuredClone(defaultOverlays) : overlays
    if (!isArray(overlays)) overlays = []

    const {width, height} = this.layerConfig()

    let viewport = (node) ? CEL.Node : CEL.Viewport

    // create viewport
    this.#viewport = new viewport({
      width: width,
      height: height,
      container: this.#elViewport
    });

    this.#elCanvas = this.#viewport.scene.canvas
    this.#overlays = new Overlays(this, overlays)
  }

  layerConfig() {
    let viewportDims;

    // normal canvas
    if (isFunction(this.#elViewport?.getBoundingClientRect)) {
      viewportDims = this.#elViewport.getBoundingClientRect()
    }
    // offscrren canvas
    else 
      viewportDims = this.#elViewport

    const buffer = this.config?.buffer || BUFFERSIZE
    const width = viewportDims.width
    const height = viewportDims.height 
    this.layerWidth = Math.round(width * ((100 + buffer) * 0.01))
    const layerConfig = { 
      width: this.layerWidth, 
      height: height
    }
    return {width, height, layerConfig}
  }

  /**
   * add an array of overlays to Graph
   * @param {Array} o - array of overlays [[name, config], ...]
   * @returns array - array of overlay statuses [[name, boolean], ...]
   */
  addOverlays(o) {
    return this.#overlays.addOverlays(o)
  }

  /**
   * add a single overlay to Graph
   * @param {string} key - identifier
   * @param {Object} overlay - {class, params}
   * @returns boolean
   */
  addOverlay(key, overlay) {
    return this.#overlays.addOverlay(key, overlay)
  }

  /**
   * remove overlay from Graph
   * @param {string} key - identifier
   * @returns boolean
   */
  removeOverlay(key) {
    return this.#overlays.removeOverlay(key)
  }

  /**
   * iterate over the list of overlays and draw them
   * @param {Object} [range=this.range]
   * @param {boolean} [update=false] - force immediate render?
   * @memberof graph
   */
  draw(range=this.range, update=false) {

    const fn = (k, overlay) => {
      // is it a valid overlay?
      if (!(overlay.instance instanceof Overlay)) return

      if (update)
        overlay.instance.setRefresh()
      
      if (isFunction(overlay.instance.draw))
        overlay.instance.draw()

      if (!overlay.fixed)
        overlay.instance.position = [this.#core.scrollPos, 0]
    }
    this.executeOverlayList(fn)
  }

  /**
   * flag all overlays / indicators to be redrawn
   */
  drawAll() {
    const fn = (k, o) => {
      // is it a valid overlay?
      if (!(o.instance instanceof Overlay)) return

      o.instance.setRefresh()
    }
    this.executeOverlayList(fn)
  }

  /**
   * execute a function on the overlay list
   * @param {function} fn
   * @return {boolean|array} - true (no errors), array of errors
   * @memberof graph
   */
  executeOverlayList(fn) {
    const oList = this.#overlays.list
    // guard against overlays host (chart pane) deletion
    if (!(oList instanceof xMap)) return false

    let result = []

    for (let [key, overlay] of oList) {
      try {
        fn(key, overlay)
      }
      catch (e) {
        result.push({overlay: key, error: e})
      }
    }
    if (result.length > 0) {
      for (let err of result) {
        this.#core.error(`ERROR: executeOverlayList() ${err.overlay}`)
        this.#core.error(err.error)
      }
    }
    else result = true
    return result
  }

  render() {
    if (this.overlays.list.has("tools"))
      this.overlays.list.get("tools").instance.render()
    this.#viewport.render()
  }

  refresh() {
    this.draw(this.range, true)
    this.render()
  }

}
