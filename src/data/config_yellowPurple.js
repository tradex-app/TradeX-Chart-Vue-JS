// import * as talib from "talib-web";
// import * as talib from '../../node_modules/talib-web/lib/index.esm'
import * as talib from 'talib-web'
import wasm from "../talib.wasm.dataURI"

// const wasm = "/node_modules/talib-web/lib/talib.wasm";
// const wasm = "/src/talib.wasm";

let rangeStartTS = undefined;

export default {
  id: "TradeX_test",
  title: "BTC/USDT",
  symbol: "btcusdt",
  // width: 1000,
  // height: 800,
  utils: {},
  tools: {},
  timeFrame: "1h",
  rangeStartTS: rangeStartTS,
  rangeLimit: 30,
  theme: {
    candle: {
      Type: "candle_down_hollow",
      UpBodyColour: "#FAEB2488",
      UpWickColour: "#FAEB24",
      DnBodyColour: "#F900FE88",
      DnWickColour: "#F900FE"
    },
    volume: {
      Height: 15,
      UpColour: "#FAEB2444",
      DnColour: "#F900FE44"
    },
    xAxis: {
      tickMarker: false
    },
    yAxis: {
      tickMarker: false
    },
    chart: {
      Background: "#141414",
      BorderColour: "#141414",
      GridColour: "#303030",
      TextColour: "#c0c0c0"
    },
    tools: {
      location: false
    },
    utils: {
      location: false
    },
    time: {
      navigation: false
    },
    legend: {
      controls: true
    }
  },
  watermark: {
    text: "BTC/USDT"
  },
  isCrypto: true,
  logs: false,
  infos: true,
  warnings: true,
  errors: true,
  // stream: streamVal,
  maxCandleUpdate: 250,
  talib: talib,
  wasm: wasm,
  state: {}
};
