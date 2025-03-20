<script setup>
  import { inject, onMounted } from 'vue';
  import featureSelect from '../htmlElements/select.vue';

  const chart = inject('chart')

  const toolPos = {
    none: {
      text: "None",
      value: "none",
    },
    left: {
      text: "Left",
      value: "left",
    },
    right: {
      text: "Right",
      value: "right",
    },
  }

  const fn = (e) => {
    chart.value.ToolsBar.show(e.target.value)
  }

  const select = {
    options: toolPos,
    fn
  }

</script>

<template>
    <featureSelect :select="select" />
</template>

<style scoped>

</style>
