<template>
  <div m-4 p-4 rounded-xl bg-white h-25>
    <el-page-header @back="jump()">
      <template #breadcrumb>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(path, index) in paths" :key="index">{{ path[0].toUpperCase() + path.slice(1) }}</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <template #content>
        <div flex items-center>
          <span font-bold>群任务</span>
        </div>
      </template>
      <template #extra>
        <div flex items-center mr-1.5 h-8>
          <el-button type="danger" v-if="task.type === 'modify'" @click="sumbit()">删除</el-button>
        </div>
      </template>
    </el-page-header>
  </div>
</template>

<script setup lang="ts">
import { deleteTask } from "@/api/task"
import { GroupPage } from "@/stores/pages/GroupPage"
import { TaskPage } from "@/stores/pages/TaskPage"
// === 更新跳转 ===
const router = useRouter()
const getBackPath = () => router.currentRoute.value.matched.slice(-2)[0].path
const getPaths = () => router.currentRoute.value.matched.slice(-1)[0].path.split("/").slice(1)
const paths = ref(getPaths())
const backUrlName = ref(getBackPath())
const jump = () => router.push(backUrlName.value)
watch(router.currentRoute, () => {
  backUrlName.value = getBackPath()
  paths.value = getPaths()
})
// ================

// === 获取page信息 ===
const task = TaskPage()
const group = GroupPage()
// ===================

// === 删除功能 ===
const sumbit = async () => {
  deleteTask([task.id])
    .then(() => {
      router.push(`/main`)
      task.id = ""
      task.type = null
      group.update.type = "group"
      group.update.time = task.time = new Date().valueOf()
      ElNotification({ message: `成功删除任务`, type: "success" })
    })
    .catch(() => ElNotification({ message: `删除任务失败`, type: "error" }))
}
</script>

<style scoped></style>
