<template>
  <div flex w-full h-17.5 p-2.5 bg-gray-50 hover:bg-gray-100 @click="chooseGroup()">
    <div w-12.5 bg-gray rounded-full flex items-center justify-center>
      <i-ic:baseline-group text-2xl text-white v-if="group.icon === null" />
      <img rounded-full @dragstart.prevent v-else :src="'/data/group/' + group.icon">
    </div>
    <div flex-grow p-1>
      <div class="h-1/2" flex items-center>
        <div flex-grow>{{ group.name }}</div>
        <div>{{ 'time' }}</div>
      </div>
      <div class="h-1/2" flex items-center>
        <div flex-grow>{{ 'message' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Group } from '@/interface/group';
import { GroupInfo } from '@/stores/GroupInfo';

// === 信息展示组件 ===
const props = withDefaults(defineProps<{
  group: Group
}>(), {})
// ===================
const groupInfo = GroupInfo()
const chooseGroup = () => {
  groupInfo.setGroup(props.group)
}

</script>