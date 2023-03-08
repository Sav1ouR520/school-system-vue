<template>
  <div flex-wrap border-2 p-2 rounded-xl border-gray-200 min-h-140>
    <div flex items-center m-2 mt-0 h-10>
      <div flex items-center flex-grow font-bold text-lg h-8>
        <span>任务:</span>
        <div flex items-center text-xs px-1 ml-2 h-8 border-2 bg-black rounded text-white>
          <span font-bold>{{ data!.task.name }}</span>
        </div>
      </div>
      <div flex items-center text-xs px-1 ml-2 h-8 border-2 bg-black rounded text-white>
        <span>创建者:</span>
        <span font-bold>{{ data!.task.member.name }}</span>
      </div>
      <div flex items-center text-xs px-1 ml-2 h-8 border-2 bg-black rounded text-white>
        <span>时间:</span>
        <span font-bold>{{ moment(data!.task.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
      </div>
    </div>
    <hr border-b-2 m-2 mb-4 />
    <div p-2 pt-0 flex-grow>
      <div flex justify-center pb-4 text-2xl font-bold>任务完成情况</div>
      <table w-full border-gray-200 border-collapse>
        <thead>
          <tr align="center" h-8>
            <th border-2 pl-2 align="left">用户</th>
            <th border-2 pr-2>文件</th>
            <th border-2 pr-2>上传时间</th>
            <th border-2 pr-2>审批</th>
          </tr>
        </thead>
        <tbody align="center">
          <tr v-for="member in data!.member" :key="member.id">
            <td border-2 pl-2 align="left">{{ member.name }}</td>
            <td border-2 pr-2 v-if="member.file.length !== 0">
              <el-button type="primary" link @click="downloadFile(member.file[0].filePath)">下载</el-button>
            </td>
            <td border-2 v-if="member.file.length !== 0">{{ moment(member.file[0].uploadTime).format("YYYY-MM-DD HH:mm:ss") }}</td>
            <td border-2 pr-2 v-if="member.file.length !== 0">
              <el-button link type="primary" @click="goBack(member.file[0].id, member.name)">退回</el-button>
            </td>
            <td v-else border-2 colspan="3">没有上传</td>
          </tr>
        </tbody>
        <tfoot align="right">
          <tr>
            <td border-2 pr-2 colspan="4">总计 {{ data?.member.length }} 人</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { findFileBytaskId, goBackFileByTaskId } from "@/api/file"
import { GroupPage } from "@/stores/pages/GroupPage"
import moment from "moment"

const page = GroupPage()
const getData = async () => (await findFileBytaskId(page.click.id)).data
const data = ref(await getData())

const downloadFile = (filePath: string) => {
  window.location.href = "/data/file/" + filePath
}
const goBack = async (id: string, name: string) => {
  await goBackFileByTaskId(id)
  data.value = await getData()
  page.update = { time: new Date().valueOf(), type: "task" }
  ElNotification({
    title: "成功",
    message: `成功退回${name}提交的文件`,
    duration: 2000,
    type: "success",
    position: "top-right",
  })
}
</script>

<style scoped></style>
