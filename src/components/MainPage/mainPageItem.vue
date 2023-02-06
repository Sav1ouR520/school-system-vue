<template>
  <div flex flex-row h-full class="prohibitCopy">
    <optionItem v-show="switchAside.isActive"></optionItem>
    <asideItem></asideItem>
    <div flex flex-col flex-grow v-if="groupInfo.hasGroup">
      <headerItem :title="groupInfo.name"></headerItem>
      <mainItem></mainItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SwitchAside } from '@/stores/SwitchAside';
import { GroupInfo } from '@/stores/GroupInfo'

// === 控制是否要展示optionItem ===
const switchAside = SwitchAside()
// ==============================

// === 控制header标题 ===
const groupInfo = GroupInfo()
// =====================
</script>

<style scoped>
* {
  user-select: none;
}
</style>
