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

<style>
  .chartFeature {
    border: 1px solid #666;
    border-radius: .5em;
    padding: .25em;
  }

  button,
  select {
    color: #ccc;
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.4em .8em;
    margin-right: 0.5em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #222;
    cursor: pointer;
    transition: border-color 0.25s;
  }
</style>