<template>
  <groupMainAddTask :dialog="dialogVisible" @close-dialog="close" @add-task="add" />
  <groupMainCard name="群任务" :num="tasks.length" :refresh="refreshData" :modify="modifyAcitve" :add="addFn" :minus="deleteActive" :sumbit="sumbit" @change-delete-status="getDeleteStatus" @change-modify-status="getModifyStatus">
    <template #icon>
      <div flex items-center justify-between rounded-full cursor-pointer @click="changeCheck()" :class="checkActive ? 'text-blue' : ''" @dragstart.prevent>
        <i-ic:baseline-list-alt />
      </div>
    </template>
    <template v-slot:list>
      <el-scrollbar>
        <div items-center border border-transparent hover:border-current cursor-pointer :class="[deleteActive ? 'hover:bg-red-100' : '', modifyAcitve ? 'hover:bg-blue-100' : '', chooseList.includes(task.id) ? 'text-red' : 'text-black']" v-for="task in tasks" :key="task.id" @click="choose(task.id)">
          <div flex h-10 w-full items-center justify-center>
            <div flex flex-grow pl-2>
              {{ task.name }}
            </div>
            <div flex justify-center pr-2>{{ task.file }}/{{ group.item.members }}</div>
          </div>
        </div>
      </el-scrollbar>
    </template>
  </groupMainCard>
</template>

<script setup lang="ts">
import { deleteTask, getTaskByGroupId } from "@/api/task"
import type { TaskMain } from "@/interface/task"
import { GroupPage } from "@/stores/pages/GroupPage"
import { TaskPage } from "@/stores/pages/TaskPage"
import { SwitchAside } from "@/stores/switch/SwitchAside"
import { useRouter } from "vue-router"

// === 初始化数据 ===
const router = useRouter()
const group = GroupPage()
const getTask = () => {
  return getTaskByGroupId(group.group.id).then(data => {
    tasks.value = data.data as TaskMain[]
    group.item.tasks = tasks.value.length ? tasks.value.length : 0
  })
}
const tasks = ref<TaskMain[]>([])
getTask()
const refreshData = () => {
  getTask()
    .then(() => ElNotification({ message: `成功刷新任务`, type: "success" }))
    .catch(() => {
      group.update = { time: new Date().valueOf(), type: "all" }
      ElNotification({ message: `刷新任务失败`, type: "error" })
    })
}
// ================

// === 数据更改监听 ===
const timer = ref(0)
group.$subscribe(
  async (mutation, state) => {
    const updateTime = state.update.time
    if (state.update.type === "all") {
      checkActive.value = modifyAcitve.value = deleteActive.value = false
    }
    if ((state.update.type === "task" || state.update.type === "all") && updateTime > timer.value) {
      timer.value = updateTime
      getTask()
    }
  },
  { detached: true, deep: true },
)
// ===================

// === 打开diglog ===
const switchAside = SwitchAside()
const dialogVisible = ref<Boolean>(false)
const addFn = () => {
  switchAside.hasDiglog = dialogVisible.value = true
}
const close = (value: boolean) => {
  switchAside.hasDiglog = dialogVisible.value = value
}
const add = () => getTask()
// ================

// === 查看任务情况 ===
const checkActive = ref<boolean>(false)
const changeCheck = () => {
  checkActive.value = !checkActive.value
  modifyAcitve.value = false
  deleteActive.value = false
}
// ===================

// === 修改任务 ===
const modifyAcitve = ref<boolean>(false)
const getModifyStatus = (value: boolean) => {
  modifyAcitve.value = value
  checkActive.value = false
}
// ===============

// === 删除任务 ===
const deleteActive = ref<boolean>(false)
const chooseList = ref<string[]>([])
// ===============

// === 重置状态 ===
const getDeleteStatus = (value: boolean) => {
  deleteActive.value = value
  chooseList.value = []
}
// ===============

// === 获取选中的task ===
const choose = (id: string) => {
  if (deleteActive.value) {
    if (!chooseList.value.includes(id)) {
      chooseList.value.push(id)
    } else {
      chooseList.value = chooseList.value.filter(x => x !== id)
    }
  } else {
    router.push(`/main/group/task`)
    group.click.id = id
    group.click.type = "task"
    if (modifyAcitve.value) {
      group.click.status = "modify"
    } else if (checkActive.value) {
      group.click.status = "check"
    } else {
      group.click.status = "add"
    }
  }
}
// ===============

// === 提交删除请求 ===
const sumbit = () => {
  if (chooseList.value.length !== 0) {
    const list = chooseList.value
    deleteTask(chooseList.value)
      .then(() => {
        if (list.includes(group.click.id)) {
          router.push(`/main/group`)
          group.click.id = ""
          group.click.type = null
        }
        getTask()
        const task = TaskPage()
        group.update.type = "group"
        group.update.time = task.time = new Date().valueOf()
        ElNotification({ message: `成功删除任务`, type: "success" })
      })
      .catch(() => ElNotification({ message: `删除任务失败`, type: "error" }))
  }
}
// ===================
</script>

<style scoped></style>
