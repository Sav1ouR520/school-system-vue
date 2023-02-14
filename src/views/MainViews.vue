<template>
  <div flex flex-row h-full bg-gray-100>
    <optionItem></optionItem>
    <asideItem></asideItem>
    <RouterView :key="id"/>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
let id = route.params.id as string
watch(route, () => {
  id = route.params.id as string
})
</script>

<style scoped>
* {
  user-select: none;
}
</style>