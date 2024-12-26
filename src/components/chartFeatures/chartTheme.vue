<script setup>
  import { inject, onMounted } from 'vue';
  import featureSelect from '../htmlElements/select.vue';
  import exotic_theme from '@/data/themes/exotic_theme';
  import dark_theme from '@/data/themes/dark_theme';
  import watermellon_theme from '@/data/themes/watermellon_theme';

  const chart = inject('chart')

  const themes = {
    exotic: {
      text: "Exotic",
      value: "exotic",
      theme: exotic_theme,
      id: null
    },
    dark: {
      text: "Dark",
      value: "dark",
      theme: dark_theme,
      id: null
    },
    watermellon: {
      text: "Watermellon",
      value: "watermellon",
      theme: watermellon_theme,
      id: null
    },
  }

  const fn = (e) => {
    const value = e.target.value
    if (!themes[value].id) 
      themes[value].id = chart.value.addTheme(themes[value].theme).id
    chart.value.setTheme(themes[value].id)
  }

  const select = {
    options: themes,
    fn
  }

</script>

<template>
    <featureSelect :select="select" />
</template>

<style scoped>

</style>
