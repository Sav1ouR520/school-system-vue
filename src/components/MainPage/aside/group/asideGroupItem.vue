<template>
  <asideHeaderItem :open="joinOpen">
    <template #add>
      <asideGroupJoinGroup :dialog="joinDialogVisible" @close-dialog="joinClose" @join-group="refresh" />
    </template>
  </asideHeaderItem>
  <el-scrollbar>
    <asideMainItem>
      <template #title>
        <h1>群组</h1>
      </template>
      <template #add>
        <div flex text-xl cursor-pointer @click="addOpen()"><i-ic:baseline-add text-2xl /></div>
        <asideGroupAddGroup :dialog="addDialogVisible" @close-dialog="addClose" @add-group="refresh" />
      </template>
      <template #content="{ isActive, timer }">
        <keep-alive>
          <asideGroupInfoItem v-if="isActive" :key="refreshTimer > timer ? refreshTimer : timer" />
        </keep-alive>
      </template> </asideMainItem
  ></el-scrollbar>
</template>
<script setup lang="ts">
import { SwitchAside } from "@/stores/switch/SwitchAside"
const switchAside = SwitchAside()

// === 添加组的diglog ===
const addDialogVisible = ref<Boolean>(false)
const addOpen = () => {
  switchAside.hasDiglog = addDialogVisible.value = true
}
const addClose = (value: boolean) => {
  switchAside.hasDiglog = addDialogVisible.value = value
}
// ================

// === 共有的刷新数据 ===
const refreshTimer = ref<number>(0)
const refresh = (value: number) => {
  refreshTimer.value = value
}
// ====================

//  === 加入组的diglog ===
const joinDialogVisible = ref<Boolean>(false)
const joinOpen = () => {
  switchAside.hasDiglog = joinDialogVisible.value = true
}
const joinClose = (value: boolean) => {
  switchAside.hasDiglog = joinDialogVisible.value = value
}
// =======================
</script>
