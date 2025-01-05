<script setup>
  import { inject } from 'vue';
  import featureButton from '../htmlElements/button.vue';

  const chart = inject('chart')

  const types = {
    start: {
      text: "Start",
      fn: () => { chart.value.jumpToStart(true) }
    },
    end: {
      text: "End",
      fn: () => { chart.value.jumpToEnd(true) }
    },
  }

</script>

<template>
  <featureButton v-for="type in types" :type="type" :key="type.text"/>
</template>

<style scoped>

</style>
