<template>
  <div v-for="member in members" :key="member.groupId">
    <div flex w-full h-17.5 p-2.5 bg-gray-50 hover:bg-gray-100 @click="router.push(`/main/group/${member.groupId}`)">
      <div w-12.5 bg-gray rounded-full flex items-center justify-center>
        <i-ic:baseline-group text-2xl text-white v-if="member.group.icon === null" />
        <img rounded-full @dragstart.prevent v-else :src="iconUrl(member.group)">
      </div>
      <div flex-grow p-1>
        <div class="h-1/2" flex items-center>
          <div flex-grow>{{ member.group.name }}</div>
          <div>{{ '人数' }}</div>
        </div>
        <div class="h-1/2" flex items-center>
          <div flex-grow>{{ '任务完成情况' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { findGroupByUserId } from '@/api/group';
import type { Group } from '@/interface/group';
import { useRouter } from 'vue-router';

// === 获取数据 ===
const members = (await findGroupByUserId()).data
// ===============

// === 路由跳转 ===
const router = useRouter()
// ===============

// === 信息展示组件 ===
const iconUrl = (group: Group) => {
  return '/data/group/' + group.icon
}
// ===================

</script>