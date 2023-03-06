<template>
  <div v-for="member in members" :key="member.groupId">
    <div flex w-full h-17.5 p-2.5 bg-gray-50 hover:bg-gray-100 @click="jump(member.groupId, member.role)">
      <div w-12.5 bg-gray rounded-full flex items-center justify-center>
        <i-ic:baseline-group text-2xl text-white v-if="member.group.icon === null" />
        <img rounded-full @dragstart.prevent v-else :src="iconUrl(member.group)" />
      </div>
      <div flex-grow px-2>
        <div class="h-1/2" flex items-center>
          <div flex-grow>{{ member.group.name }}</div>
          <div>人数: {{ group.item.members }}</div>
        </div>
        <div class="h-1/2" flex items-center></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { findGroupByUserId } from "@/api/group"
import type { Group } from "@/interface/group"
import { GroupPage } from "@/stores/pages/GroupPage"
import { useRouter } from "vue-router"
import { PageInfo } from "@/stores/pages/PageInfo"

// === 获取数据 ===
const getMembers = async () => (await findGroupByUserId()).data
const members = ref(await getMembers())
// ===============

// === 路由跳转 ===
const router = useRouter()
const group = GroupPage()
const page = PageInfo()
const jump = (groupId: string, role: "user" | "admin") => {
  router.push(`/main/group`)
  group.group.id = groupId
  group.userRole = role
  page.setPageInfo({ type: "group", id: groupId })
}
// ===============

// === 数据更改监听 ===
const timer = ref(0)
group.$subscribe(
  async (mutation, state) => {
    const updateTime = state.update.time
    if ((state.update.type === "group" && updateTime > timer.value) || state.group.id === "") {
      timer.value = updateTime
      members.value = await getMembers()
    }
  },
  { detached: true, deep: true },
)
// ===================

// === 信息展示组件 ===
const iconUrl = (group: Group) => {
  return "/data/group/" + group.icon
}
// ===================
</script>
