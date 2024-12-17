<script setup>
  import { inject } from 'vue';
  import featureSelect from '../htmlElements/select.vue';

  const chart = inject('chart')

  const options = {
    BB: { text: "Bollinger Bands BB", value: "BB" },
    RSI: { text: "Relative Strength Index RSI", value: "RSI" },
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
