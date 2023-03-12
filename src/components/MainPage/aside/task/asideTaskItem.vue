<template>
  <asideHeaderItem :open="createOpen">
    <template #add>
      <asideAddTask :dialog="createDialogVisible" @close-dialog="createClose" @add-task="refresh" />
    </template>
  </asideHeaderItem>
  <el-scrollbar>
    <asideMainItem>
      <template v-slot:title>
        <h1>我发布的任务</h1>
      </template>
      <template #content="{ isActive, timer }">
        <keep-alive>
          <asideCreateTaskItem v-if="isActive" :key="refreshTimer > timer ? refreshTimer : timer" />
        </keep-alive>
      </template>
    </asideMainItem>
    <asideMainItem>
      <template v-slot:title>
        <h1>接收到的任务</h1>
      </template>
      <template #content="{ isActive, timer }">
        <keep-alive>
          <asideReceiveTaskItem v-if="isActive" :key="refreshTimer > timer ? refreshTimer : timer" />
        </keep-alive>
      </template> </asideMainItem
  ></el-scrollbar>
</template>

<script setup lang="ts">
import { SwitchAside } from "@/stores/switch/SwitchAside"
const switchAside = SwitchAside()

// === 共有的刷新数据 ===
const refreshTimer = ref<number>(0)
const refresh = (value: number) => {
  refreshTimer.value = value
}
// ====================

//  === 创建任务的diglog ===
const createDialogVisible = ref<Boolean>(false)
const createOpen = () => {
  switchAside.hasDiglog = createDialogVisible.value = true
}
const createClose = (value: boolean) => {
  switchAside.hasDiglog = createDialogVisible.value = value
}
// =======================
</script>
