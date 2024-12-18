<script setup>
  import { inject } from 'vue';
  import featureButton from '../htmlElements/button.vue';

  const chart = inject('chart')

  const types = {
    solid: {
      text: "Full Screen",
      fn: () => { chart.value.requestFullscreen() }
    },
  }

</script>

<template>
  <featureButton v-for="type in types" :type="type" />
</template>

<style scoped>

</style>
