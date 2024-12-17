<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    select: Object,
  })
</script>

<template>
  <select @change="props.select.fn">
    <option
      v-for="option in props.select.options"
      :value="option.value"
    >
      {{ option.text }}
    </option>
  </select>
</template>

<style scoped>
  button {
    display: inline;
  }
</style>
