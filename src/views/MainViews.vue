<template>
  <div flex flex-row h-full bg-gray-100>
    <optionItem></optionItem>
    <asideItem v-if="aside.item !== 'user'"></asideItem>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { SwitchAside } from '@/stores/switch/SwitchAside';
const aside= SwitchAside()
</script>

<style scoped>
* {
  user-select: none;
}
</style>
