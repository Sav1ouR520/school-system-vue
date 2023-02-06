<template>
  <div flex h-12.5 bg-white>
    <div flex items-center p-2 cursor-pointer @click="switchAside.isActive = !switchAside.isActive">
      <i-ic:baseline-density-medium text-xl text-gray-800 />
    </div>
    <div flex items-center flex-grow>
      <el-input>
        <template #prefix>
          <i-ic:round-search text-xl />
        </template>
      </el-input>
    </div>
    <div flex items-center p-2 cursor-pointer @click="open()">
      <i-ic:baseline-add text-2xl text-gray-800 />
    </div>
    <addGroupItem :dialog="dialogVisible" @close-dialog="close"></addGroupItem>
  </div>
</template>

<script setup lang="ts">
import { SwitchAside } from '@/stores/SwitchAside.js';

// === 打开diglog ===
const switchAside = SwitchAside()
const dialogVisible = ref<Boolean>(false)
const open = () => {
  switchAside.hasDiglog = dialogVisible.value = true
}
const close = (value: boolean) => {
  switchAside.hasDiglog = dialogVisible.value = value
}
// ================

</script>