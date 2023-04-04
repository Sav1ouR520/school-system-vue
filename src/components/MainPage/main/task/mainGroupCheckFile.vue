<template>
  <div flex items-center mx-2 mb-4 h-10>
    <div flex items-center flex-grow font-bold h-8>
      <span text-2xl>任务名:</span>
      <div flex items-center mt-1 px-1 ml-2 h-8 bg-black rounded text-white>
        <span font-bold>{{ data!.task.name }}</span>
      </div>
    </div>
    <div flex items-center text-xs px-1 ml-2 h-8 bg-black rounded text-white>
      <span>创建者:</span>
      <span font-bold>{{ data!.task.member.name }}</span>
    </div>
    <div flex items-center text-xs px-1 ml-2 h-8 bg-black rounded text-white>
      <span>时间:</span>
      <span font-bold>{{ moment(data!.task.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
    </div>
  </div>
  <div pt-0 flex-grow border-4 m-2 rounded>
    <table w-full>
      <thead h-12>
        <tr align="center" text-4>
          <th pl-4 align="left">用户</th>
          <th>文件</th>
          <th>上传时间</th>
          <th>审批</th>
        </tr>
      </thead>
      <tbody align="center" font-bold h-12>
        <tr v-for="member in data!.member" :key="member.id" >
          <td pl-4 align="left" >{{ member.name }}</td>
          <td v-if="member.file.length !== 0">
            <a cursor-pointer text-blue @click="downloadFile(member.file[0].filePath)">下载</a>
          </td>
          <td v-if="member.file.length !== 0">{{ moment(member.file[0].uploadTime).format("YYYY-MM-DD HH:mm:ss") }}</td>
          <td v-if="member.file.length !== 0">
            <a cursor-pointer text-blue @click="goBack(member.file[0].id, member.name)">退回</a>
          </td>
          <td v-else colspan="3" >没 有 上 传</td>
        </tr>
      </tbody>
      <tfoot align="center" h-12>
        <tr font-bold>
          <td colspan="3"></td>
          <td>总计 {{ data?.member.length }} 人</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { findFileBytaskId, goBackFileByTaskId } from "@/api/file"
import type { MemberWithTask } from "@/interface/member"
import { GroupPage } from "@/stores/pages/GroupPage"
import { TaskPage } from "@/stores/pages/TaskPage"
import moment from "moment"

const task = TaskPage()
const group = GroupPage()
const router = useRouter()
const getData = () => {
  findFileBytaskId(group.click.id)
    .then(items => (data.value = items.data as MemberWithTask))
    .catch(async () => {
      router.push("/main/group")
      group.update = { time: new Date().valueOf(), type: "all" }
      ElNotification({ message: `权限不足/任务不存在`, type: "error" })
    })
}
const data = ref<MemberWithTask>({ member: [], task: { id: "", name: "", introduce: "", memberId: "", groupId: "", activeStatue: true, dataPath: null, createTime: new Date(), member: { id: "", name: "", groupId: "", userId: "", role: "admin", joinTime: new Date(), icon: "" } } })
getData()
const downloadFile = (filePath: string) => {
  window.location.href = "/data/file/" + filePath
}
const goBack = (id: string, name: string) => {
  goBackFileByTaskId(id)
    .then(() => {
      getData()
      group.update = { time: new Date().valueOf(), type: "task" }
      task.time = new Date().valueOf()
      ElNotification({ message: `成功退回${name}提交的文件`, type: "success" })
    })
    .catch(() => {
      router.push("/main/group")
      group.update = { time: new Date().valueOf(), type: "all" }
      ElNotification({ message: `权限不足`, type: "error" })
    })
}

// === 监听数据变化 ===
const clickid = ref(group.click.id)
group.$subscribe(
  async (mutation, state) => {
    if (state.click.type === "task" && state.click.status === "check" && clickid.value !== state.click.id) {
      clickid.value = group.click.id
      getData()
    }
  },
  { detached: true, deep: true },
)
// ===============
</script>

<style scoped></style>
