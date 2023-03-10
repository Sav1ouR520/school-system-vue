<template>
  <div flex items-center bg-gray-200 h-12.5 >
    <div flex flex-grow items-center cursor-pointer @click="changeIcon()">
      <div :class="icon"></div>
      <slot name="title"></slot>
    </div>
    <slot name="add"></slot>
    <div flex text-xl mr-3 cursor-pointer @click="refresh()"> <i-ic:round-refresh /></div>
  </div>
  <slot name="content" :isActive="isActive" :timer="timer"></slot>
</template>
<script setup lang="ts">

// === 刷新/加载组的数据 ===
const isActive = ref<Boolean>(true)
const icon = ref<String>()
const timer = ref<number>(new Date().valueOf())
const refresh = () => {
  isActive.value = false
  changeIcon()
  timer.value = new Date().valueOf()
}
const changeIcon = () => {
  isActive.value = !isActive.value
  icon.value = isActive.value ? "i-ic:outline-keyboard-arrow-down" : "i-ic:outline-keyboard-arrow-right"
}
changeIcon()
// =======================

</script>