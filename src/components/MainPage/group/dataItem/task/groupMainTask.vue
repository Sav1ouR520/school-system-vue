<template>
  <groupMainCard name="群任务" :num="tasks.data!.length" :add="addFn" :minus="deleteActive" :sumbit="sumbit"
    @change-status="getStatus">
    <template v-slot:list>
      <el-scrollbar>
        <div flex flex-col items-center border border-transparent hover:border-current cursor-pointer
          :class="[deleteActive ? 'hover:bg-red-100' : 'hover:bg-gray-100', chooseList.includes(task.id) ? 'text-red' : 'text-black']"
          v-for="task in tasks.data" :key="task.id" @click="choose(task.id)">
          <div flex h-10 w-full items-center justify-center>
            <div flex flex-grow>
              {{ task.name }}
            </div>
            <div flex justify-center>{{ task.file.length }}/{{ MemberNumber }}</div>
          </div>
        </div>
      </el-scrollbar>
    </template>
  </groupMainCard>
  <groupMainAddTask :dialog="dialogVisible" :id="prop.id" @close-dialog="close" @send-data="sendData" />
</template>

<script setup lang="ts">
import { deleteTask, getTasks } from "@/api/task"
import type { Task } from "@/interface/task";
import { SwitchAside } from "@/stores/SwitchAside.js"
import type { ResponseData } from "@/utils/request"
import { useRouter } from 'vue-router';

const router = useRouter()

const getData = async () => await getTasks(prop.id)
const prop = defineProps<{ id: string; MemberNumber: number }>()
const tasks = ref<ResponseData<Task[]>>(await getData())

// === 打开diglog ===
const switchAside = SwitchAside()
const dialogVisible = ref<Boolean>(false)
const addFn = () => {
  switchAside.hasDiglog = dialogVisible.value = true
}
const close = (value: boolean) => {
  switchAside.hasDiglog = dialogVisible.value = value
}
// ================

// === 删除任务 ===
const deleteActive = ref<boolean>(false)
const chooseList = ref<string[]>([])

// 重置状态
const getStatus = (value: boolean) => {
  deleteActive.value = value
  chooseList.value = []
}

// 获取选中的task
const choose = (id: string) => {
  if (deleteActive.value) {
    if (!chooseList.value.includes(id)) {
      chooseList.value.push(id)
    } else {
      chooseList.value = chooseList.value.filter((x) => x !== id);
    }
  } else {
    router.push(`/main/group/${prop.id}?task=${id}`)
    chooseList.value = []
  }
}

// 提交删除请求
const sumbit = async () => {
  if (chooseList.value.length !== 0) {
    await deleteTask(chooseList.value)
    ElNotification({
      title: '成功',
      message: `成功删除任务`,
      duration: 2000,
      type: 'success',
      position: 'top-right',
    })
    refresh()
  }
}
// =========

// === 刷新数据 ===
const refresh = async () => {
  tasks.value = await getData()
}
const sendData = (data: ResponseData<Task[]>) => {
  tasks.value = data
}
// ===============
</script>

<style scoped>

</style>
