<template>
  <div flex flex-row h-full bg-gray-100>
    <optionItem></optionItem>
    <asideItem></asideItem>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
* {
  user-select: none;
}
</style>
