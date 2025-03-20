<script setup>
  import { inject } from 'vue';
  import featureSelect from '../htmlElements/select.vue';

  const chart = inject('chart')

  const options = {
    ADX: { text: "Average Directional Index", value: "ADX" },
    AROON: { text: "Aroon", value: "AROON" },
    ATR: { text: "Average True Range", value: "ATR" },
    BB: { text: "Bollinger Bands BB", value: "BB" },
    CCI: { text: "Commodity Channel Index", value: "CCI" },
    CMO: { text: "Chande Momentum Oscillator", value: "CMO" },
    DMI: { text: "Directional Movement Index", value: "DMI" },
    EMA: { text: "Exponential Moving Average", value: "EMA" },
    MA: { text: "Moving Average", value: "MA" },
    EMA: { text: "Exponential Moving Average", value: "EMA" },
    MACD: { text: "Moving Average Convergence/Divergence", value: "MACD" },
    MFI: { text: "Money Flow Index", value: "MFI" },
    PPO: { text: "Percentage Price Oscillator", value: "PPO" },
    ROC: { text: "Rate of Change", value: "ROC" },
    RSI: { text: "Relative Strength Index", value: "RSI" },
    SMA: { text: "Simple Moving Average", value: "SMA" },
    Volume: { text: "Volume", value: "VOL" }
  }

  const fn = (e) => {
    chart.value.addIndicator(e.target.value)
  }

  const select = {
    options,
    fn
  }

</script>

<template>
  <featureSelect :select="select" />
</template>

<style scoped>

</style>
