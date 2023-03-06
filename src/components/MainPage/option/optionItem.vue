<template>
  <div flex flex-col bg-gray-900 :style="optionWidth" v-show="switchAside.isActive">
    <div flex-grow>
      <optionIconItem item="group" icon="i-ic:baseline-groups" />
      <optionIconItem item="task" icon="i-carbon:task" />
    </div>
    <div>
      <optionIconItem item="user" icon="i-carbon:user-avatar-filled" />
      <optionIconItem item="setting" icon="i-ic:baseline-settings" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SwitchAside } from '@/stores/switch/SwitchAside.js';

// === options的宽度控制 ===
const switchAside = SwitchAside()
const optionWidth = reactive({
  width: switchAside.optionWidth + "px"
})
// ========================
</script>