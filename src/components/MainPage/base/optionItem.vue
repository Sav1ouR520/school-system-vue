<template>
  <div flex flex-col bg-gray-900 :style="optionWidth">
    <div flex-grow>
      <iconItem item="group" icon="i-ic:baseline-group" />
      <iconItem item="task" icon="i-carbon:task" />
    </div>
    <div>
      <iconItem item="user" icon="i-carbon:user-avatar-filled" />
      <iconItem item="setting" icon="i-ic:baseline-settings" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SwitchAside } from '@/stores/SwitchAside.js';

// === options的宽度控制 ===
const switchAside = SwitchAside()
const optionWidth = reactive({
  width: switchAside.optionWidth + "px"
})
// ========================

</script>