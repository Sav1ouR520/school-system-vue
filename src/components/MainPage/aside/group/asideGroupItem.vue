<template>
  <asideHeaderItem>
    <template #add>
      <div flex h-12.5 items-center p-2 pl-0 cursor-pointer @click="open()">
        <i-ic:baseline-add text-2xl text-gray-800 />
      </div>
      <asideGroupAddGroup :dialog="dialogVisible" @close-dialog="close" />
    </template>
  </asideHeaderItem>
  <asideMainItem>
    <template #title>
      <h1>群组</h1>
    </template>
    <template #content="{ isActive, timer }">
      <Suspense>
        <template #default>
          <keep-alive>
            <asideGroupInfoItem v-if="isActive" :key="timer" />
          </keep-alive>
        </template>
      </Suspense>
    </template>
  </asideMainItem>
</template>
<script setup lang="ts">

// === 打开diglog ===
import { SwitchAside } from '@/stores/SwitchAside.js';
const switchAside = SwitchAside()
const dialogVisible = ref < Boolean > (false)
const open = () => {
  switchAside.hasDiglog = dialogVisible.value = true
}
const close = (value: boolean) => {
  switchAside.hasDiglog = dialogVisible.value = value
}
// ================
</script>