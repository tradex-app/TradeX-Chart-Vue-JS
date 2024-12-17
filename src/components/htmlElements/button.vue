<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    type: Object,
  })
</script>

<template>
  <button @click="props.type.fn()">
    {{ props.type.text }}
  </button>
</template>

<style scoped>
  button {
    display: inline;
  }
</style>
