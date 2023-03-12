<template>
  <div v-for="group in groups" :key="group.id">
    <div flex w-full h-17.5 p-2.5 bg-gray-50 hover:bg-gray-100 @click="jump(group.id)">
      <div w-12.5 flex items-center justify-center>
        <el-avatar :size="50" :src="group.icon ? '/data/group/' + group.icon : ''" @dragstart.prevent>
          <i-ic:baseline-image text-3xl />
        </el-avatar>
      </div>
      <div flex-grow pl-2 text-gray-500 text-2>
        <div class="h-1/2" flex items-center font-bold>
          <span flex-grow text-4 text-gray-700>{{ group.name }}</span>
          <span> {{ moment(group.createTime).format("YYYY-MM-DD") }}</span>
        </div>
        <div class="h-1/2" flex items-center font-bold>
          <span flex-grow>人数: {{ group.member }}</span>
          <span>任务总量: {{ group.task }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { findGroupByUserId } from "@/api/group"
import { GroupPage } from "@/stores/pages/GroupPage"
import { useRouter } from "vue-router"
import moment from "moment"
import type { AsideGroup } from "@/interface/group"

// === 获取数据 ===
const groups = ref<AsideGroup[]>()
findGroupByUserId().then(data => (groups.value = data.data))
// ===============

// === 路由跳转 ===
const router = useRouter()
const group = GroupPage()
const jump = (groupId: string) => {
  router.push(`/main/group`)
  group.group.id = groupId
}
// ===============

// === 数据更改监听 ===
const timer = ref(0)
group.$subscribe(
  (mutation, state) => {
    const updateTime = state.update.time
    if (state.update.type === "group" && updateTime > timer.value) {
      timer.value = updateTime
      findGroupByUserId().then(data => (groups.value = data.data))
    }
  },
  { detached: true, deep: true },
)
// ===================
</script>
