<template>
  <div flex bg-white>
    <div flex h-12.5 w-10 justify-center items-center cursor-pointer @click="switchAside.isActive = !switchAside.isActive">
      <i-ic:baseline-density-medium text-xl text-gray-800 />
    </div>
    <div flex h-12.5 items-center flex-grow  >
      <div  flex items-center justify-center rounded border-gary flex-grow h-8 border-2  bg-gray-900  text-white>提 交 通</div>
    </div>
    <div flex h-12.5 justify-center items-center w-10  cursor-pointer>
      <i-ic:baseline-add text-2xl @click="open()" />
    </div>
    <slot name="add"></slot>
  </div>
</template>

<script setup lang="ts">
import { SwitchAside } from "@/stores/switch/SwitchAside.js"
const switchAside = SwitchAside()
defineProps<{
  open: Function
}>()
</script>
