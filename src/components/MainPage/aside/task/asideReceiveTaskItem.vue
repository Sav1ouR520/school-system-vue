<template>
  <div v-for="item in data" :key="item.task.id">
    <div flex w-full h-17.5 p-2.5 bg-gray-50 hover:bg-gray-100 @click="jump(item.task.id)">
      <div w-12.5 flex items-center justify-center>
        <el-avatar :size="50" :src="item.group.icon ? '/data/group/' + item.group.icon : ''">
          <i-ic:baseline-image text-3xl />
        </el-avatar>
      </div>
      <div flex-grow pl-2 text-gray-500>
        <div class="h-1/2" flex items-center font-bold>
          <span flex-grow text-4 text-gray-700>{{ item.task.name }}</span>
          <div flex items-center justify-center text-1 rounded border-2 p-0.5 text-white w-12 :class="item.task.file ? 'bg-green' : 'bg-black'">{{ item.task.file ? "完成" : "未完成" }}</div>
        </div>
        <div class="h-1/2" flex items-center font-bold>
          <span text-2>来源: {{ item.group.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { findTasksByUserId } from "@/api/task"
import { TaskPage } from "@/stores/pages/TaskPage"
import type { AsideTask } from "@/interface/task";

// === 获取数据 ===
const data = ref<AsideTask[]>()
findTasksByUserId().then(items=>data.value=items.data)
// ===============

// === 路由跳转 ===
const router = useRouter()
const jump = (taskId: string) => {
  router.push(`/main/task`)
  page.id = taskId
  page.type = "upload"
}
// ===============

// === 数据更改监听 ===
const page = TaskPage()
const timer = ref(0)
page.$subscribe(
  async (mutation, state) => {
    const updateTime = state.time
    if (updateTime > timer.value) {
      timer.value = updateTime
      findTasksByUserId().then(items=>data.value=items.data)
    }
  },
  { detached: true, deep: true },
)
// ===================
</script>
