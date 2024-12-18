<script setup>
  import { inject } from 'vue';
  import featureSelect from '../htmlElements/select.vue';

  const chart = inject('chart')

  const options = {
    AROON: { text: "Aroon", value: "AROON" },
    BB: { text: "Bollinger Bands BB", value: "BB" },
    EMA: { text: "Exponential Moving Average", value: "EMA" },
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
