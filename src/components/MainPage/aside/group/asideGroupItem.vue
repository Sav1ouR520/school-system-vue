<template>
  <asideHeaderItem>
    <template #add>
      <div flex h-12.5 items-center p-2 pl-0 cursor-pointer @click="open()">
        <i-ic:baseline-add text-2xl text-gray-800 />
      </div>
      <asideGroupAddGroup :dialog="dialogVisible" @close-dialog="close" @add-group="add" />
    </template>
  </asideHeaderItem>
  <asideMainItem>
    <template #title>
      <h1>群组</h1>
    </template>
    <template #content="{ isActive, timer }">
      <Suspense>
        <template #default>
          <el-scrollbar>
            <keep-alive>
              <asideGroupInfoItem v-if="isActive" :key="addTimer > timer ? addTimer : timer" />
            </keep-alive>
          </el-scrollbar>
        </template>
      </Suspense>
    </template>
  </asideMainItem>
</template>
<script setup lang="ts">
// === 打开diglog ===
import { SwitchAside } from "@/stores/switch/SwitchAside"
const switchAside = SwitchAside()
const dialogVisible = ref<Boolean>(false)
const addTimer = ref<number>(0)
const open = () => {
  switchAside.hasDiglog = dialogVisible.value = true
}
const close = (value: boolean) => {
  switchAside.hasDiglog = dialogVisible.value = value
}
const add = (value: number) => {
  addTimer.value = value
}
// ================
</script>
