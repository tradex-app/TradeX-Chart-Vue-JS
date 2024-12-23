<script setup>
  import { defineProps, onMounted } from 'vue';

  const props = defineProps({
    type: Object,
  })

  function onClick() { props.type.fn() }
</script>

<template>
  <button @click="onClick">
    {{ props.type.text }}
  </button>
</template>

<style scoped>
  button {
    display: inline;
  }
</style>
