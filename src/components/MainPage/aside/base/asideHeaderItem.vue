<template>
  <div flex bg-white>
    <div flex h-12.5 items-center p-2 cursor-pointer @click="switchAside.isActive = !switchAside.isActive">
      <i-ic:baseline-density-medium text-xl text-gray-800 />
    </div>
    <div flex h-12.5 items-center flex-grow pr-2>
      <el-input>
        <template #prefix>
          <i-ic:round-search text-xl />
        </template>
      </el-input>
    </div>
    <slot name="add"></slot>
  </div>
</template>

<script setup lang="ts">

import { SwitchAside } from '@/stores/switch/SwitchAside.js';
const switchAside = SwitchAside()

</script>