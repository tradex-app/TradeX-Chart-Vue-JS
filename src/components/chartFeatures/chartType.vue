<script setup>
  import { inject } from 'vue';
  import featureButton from '../htmlElements/button.vue';

  const chart = inject('chart')

  const types = {
    solid: {
      text: "Solid",
      fn: () => { chart.value.theme.setProperty("candle.Type", "candle_solid") }
    },
    hollow: {
      text: "Hollow",
      fn: () => { chart.value.theme.setProperty("candle.Type", "candle_hollow") }
    },
    hollowUp: {
      text: "Hollow Up",
      fn: () => { chart.value.theme.setProperty("candle.Type", "candle_up_hollow") }
    },
    hollowDn: {
      text: "Hollow Dn",
      fn: () => { chart.value.theme.setProperty("candle.Type", "candle_down_hollow") }
    },
    ohlc: {
      text: "OHLC",
      fn: () => { chart.value.theme.setProperty("candle.Type", "ohlc") }
    },
    area: {
      text: "Area",
      fn: () => { chart.value.theme.setProperty("candle.Type", "area") }
    },
    line: {
      text: "Line",
      fn: () => { chart.value.theme.setProperty("candle.Type", "line") }
    }
  }

</script>

<template>
  <featureButton v-for="type in types" :type="type" />
</template>

<style scoped>

</style>
