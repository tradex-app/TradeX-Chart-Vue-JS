<script setup>
  import { inject } from 'vue';
  import featureButton from '../htmlElements/button.vue';

  const chart = inject('chart')

  const types = {
    solid: {
      text: "Export Image",
      fn: () => { chart.value.downloadImage(`tradex-chart-${chart.value.id}.png`) }
    },
  }

</script>

<template>
  <featureButton v-for="type in types" :type="type" :key="type"/>
</template>

<style scoped>

</style>
