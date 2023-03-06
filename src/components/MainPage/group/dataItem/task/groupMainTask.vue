<template>
  <groupMainAddTask :dialog="dialogVisible" @close-dialog="close" @add-task="add" />
  <groupMainCard name="群任务" :num="tasks.length" :modify="modifyAcitve" :add="addFn" :minus="deleteActive" :sumbit="sumbit" @change-delete-status="getDeleteStatus" @change-modify-status="getModifyStatus">
    <template v-slot:list>
      <el-scrollbar>
        <div items-center border border-transparent hover:border-current cursor-pointer :class="[deleteActive ? 'hover:bg-red-100' : '', modifyAcitve ? 'hover:bg-blue-100' : '', chooseList.includes(task.id) ? 'text-red' : 'text-black']" v-for="task in tasks" :key="task.id" @click="choose(task.id)">
          <div flex h-10 w-full items-center justify-center>
            <div flex flex-grow pl-2>
              {{ task.name }}
            </div>
            <div flex justify-center pr-2>{{ task.file.length }}/{{ page.item.members }}</div>
          </div>
        </div>
      </el-scrollbar>
    </template>
  </groupMainCard>
</template>

<script setup lang="ts">
import { deleteTask, getTasksByGroupId } from "@/api/task"
import { GroupPage } from "@/stores/pages/GroupPage"
import { SwitchAside } from "@/stores/switch/SwitchAside"
import { useRouter } from "vue-router"

// === 初始化数据 ===
const router = useRouter()
const page = GroupPage()
const getTask = async () => (await getTasksByGroupId(page.group.id)).data
const data = await getTask()
const tasks = ref(data ? data : [])
page.item.tasks.total = tasks.value.length
const getFinlishTaskNumber = () => {
  let finishTaskNumber = 0
  tasks.value.forEach(item => {
    if (item.file.length === page.item.members) {
      finishTaskNumber += 1
    }
  })
  return finishTaskNumber
}
page.item.tasks.finish = getFinlishTaskNumber()
// ================

// === 数据更改监听 ===
const timer = ref(0)
page.$subscribe(
  async (mutation, state) => {
    const updateTime = state.update.time
    if (state.update.type === "task" && updateTime > timer.value) {
      timer.value = updateTime
      const data = await getTask()
      tasks.value = data ? data : tasks.value
      page.item.tasks.finish = getFinlishTaskNumber()
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
const add = async () => {
  const data = await getTask()
  tasks.value = data ? data : []
}
// ================

// === 修改任务 ===
const modifyAcitve = ref<boolean>(false)
const getModifyStatus = (value: boolean) => {
  modifyAcitve.value = value
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
    page.click.id = id
    page.click.type = "task"
    if (modifyAcitve.value) {
      page.click.status = "modify"
    } else {
      page.click.status = "add"
    }
  }
}
// ===============

// === 提交删除请求 ===
const sumbit = async () => {
  if (chooseList.value.length !== 0) {
    const list = chooseList.value
    await deleteTask(chooseList.value)
    if (list.includes(page.click.id)) {
      router.push(`/main/group`)
      page.click.id = ""
      page.click.type = null
    }
    const data = await getTask()
    tasks.value = data ? data : []
    ElNotification({
      title: "成功",
      message: `成功删除任务`,
      duration: 2000,
      type: "success",
      position: "top-right",
    })
  }
}
// ===================
</script>

<style scoped></style>
