<script setup>
  const props = defineProps({
    title: String,
  })
</script>

<template>
  <h2>{{ props.title }}</h2>
  <div class="chartFeature">
    <slot></slot>
  </div>
</template>

<style scoped>
  .chartFeature {
    border: 1px solid #666;
    border-radius: .5em;
  }
</style>