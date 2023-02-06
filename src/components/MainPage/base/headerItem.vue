<template>
  <div bg-gray-100 flex items-center justify-center>
    <div flex-grow pl-3 h-12.5 flex items-center>
      <h1 text-2xl font-bold>{{ title }}</h1>
    </div>
    <div flex justify-center items-center w-12.5>
      <i-ic:baseline-more-horiz text-2xl />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>

</style>