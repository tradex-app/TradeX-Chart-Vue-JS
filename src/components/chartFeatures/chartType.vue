<script setup>
  import { inject } from 'vue';
  import featureSelect from '../htmlElements/select.vue';

  const chart = inject('chart')

  const types = {
    solid: {
      text: "Solid",
      value: "candle_solid"
    },
    hollow: {
      text: "Hollow",
      value: "candle_hollow"
    },
    hollowUp: {
      text: "Hollow Up",
      value: "candle_up_hollow"
    },
    hollowDn: {
      text: "Hollow Dn",
      value: "candle_down_hollow"
    },
    ohlc: {
      text: "OHLC",
      value: "ohlc"
    },
    area: {
      text: "Area",
      value: "area"
    },
    line: {
      text: "Line",
      value: "line"
    }
  }

  const fn = (e) => {
    chart.value.theme.setProperty("candle.Type", e.target.value)
  }

  const select = {
    options: types,
    fn
  }

</script>

<template>
    <featureSelect :select="select" />
</template>

<style scoped>

</style>
