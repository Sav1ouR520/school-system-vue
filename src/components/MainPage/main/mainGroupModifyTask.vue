<template>
  <div border-2 p-2 rounded-xl border-gray-200>
    <div flex items-center m-2 mt-0 h-10 >
      <div flex items-center flex-grow font-bold text-lg h-8>群任务</div>
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
    <el-form mx-2 hide-required-asterisk status-icon :rules="rules" :model="formTask" ref="ruleFormRef" @submit.prevent>
      <div flex items-center justify-center text-xs mb-4 h-8 border-2 bg-gray rounded text-white >
        <span mr-1>标识:</span>
        <span font-bold>[{{ data!.task.id }}]</span>
      </div>
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="formTask.name" />
      </el-form-item>
      <el-form-item label="任务简介" prop="introduce">
        <el-input h-50 resize="none" type="textarea" v-model="formTask.introduce" />
      </el-form-item>
      <el-form-item label="开启上传">
        <el-radio-group v-model="hasData">
          <el-radio-button :label="true">开启</el-radio-button>
          <el-radio-button :label="false" @click="cancelFile()">关闭</el-radio-button>
        </el-radio-group>
        <div v-if="data!.task.dataPath">
          <el-button @click="downloadFile()" type="primary" plain> 下载前置文件 </el-button>
          <el-button @click="deleteFile()" type="danger" plain>删除前置文件</el-button>
        </div>
      </el-form-item>
      <el-form-item label="文件上传">
        <el-upload flex flex-col flex-grow action="#" ref="upload" :file-list="fileList" :on-change="handleChange" :on-remove="handleRemove" :auto-upload="false" :disabled="!hasData" multiple drag>
          <div flex justify-between :class="hasData ? 'text-blue' : ''">
            <div flex flex-grow items-center justify-center rounded-xl>
              <i-ep:upload-filled text-8.4 />
              <p>拖拽文件到此处或点击上传</p>
            </div>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" w-full @click="sumbit(ruleFormRef)">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { findTaskByTaskId, modifyTask, deleteTaskFile } from "@/api/task"
import type { FormInstance, FormItemRule, UploadFiles, UploadInstance, UploadProps } from "element-plus"
import moment from "moment"

import type { ModifyTask } from "@/interface/task"
import { FileZip } from "@/utils/filezip"
import { GroupPage } from "@/stores/pages/GroupPage"

// === 查找task信息 ===
const page = GroupPage()
const refreshData = async () => (await findTaskByTaskId(page.click.id)).data
const data = ref(await refreshData())
// ===================

// === 监听数据变化 ===
const clickid = ref(page.click.id)
page.$subscribe(
  async (mutation, state) => {
    if (state.click.type === "task" && state.click.status === "modify" && clickid.value !== state.click.id) {
      clickid.value = page.click.id
      data.value = await refreshData()
    }
  },
  { detached: true, deep: true },
)
// ===============

// === 文件上传/下载功能 ===
const hasData = ref<Boolean>(false)
const upload = ref<UploadInstance>()
const fileList = ref<UploadFiles>([])

const handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  fileList.value = uploadFiles
}

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  fileList.value = uploadFiles
}

const cancelFile = () => {
  upload.value!.clearFiles()
}
const downloadFile = () => {
  window.location.href = "/data/task/" + data.value!.task.dataPath
}
// ====================

// === 表单验证 ===
const formTask = reactive<ModifyTask>({
  id: data.value!.task.id,
  name: data.value!.task.name,
  introduce: data.value!.task.introduce,
  file: new Blob(),
})
const ruleFormRef = ref<FormInstance>()
type FormTaskRule = {
  [k in keyof ModifyTask]?: Array<FormItemRule>
}
const rules = reactive<FormTaskRule>({
  name: [
    { required: true, message: "组名不能为空", trigger: "blur" },
    { required: true, message: "组名不能为空", trigger: "change" },
  ],
  introduce: [
    { required: true, message: "简介不能为空", trigger: "blur" },
    { required: true, message: "简介不能为空", trigger: "change" },
  ],
})

const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  cancelFile()
  // formEl.resetFields()
  hasData.value = false
  formTask.file = new Blob()
}

const sumbitAction = async (formEl: FormInstance) => {
  await modifyTask(formTask, hasData.value && fileList.value.length !== 0)
  cancel(formEl)
  data.value = await refreshData()
  page.update = { time: new Date().valueOf(), type: "task" }
  ElNotification({
    title: "成功",
    message: `成功修改任务${formTask.name}`,
    duration: 2000,
    type: "success",
    position: "top-right",
  })
}

const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      if (hasData.value && fileList.value.length !== 0) {
        const files: File[] = []
        fileList.value.forEach(val => {
          if (val.raw) {
            files.push(val.raw)
          }
        })
        formTask.file = await FileZip(files)
        sumbitAction(formEl)
      } else {
        sumbitAction(formEl)
      }
    }
  })
}

const deleteFile = async () => {
  await deleteTaskFile(data.value!.task.id)
  ElNotification({
    title: "成功",
    message: `成功移除${formTask.name}的文件`,
    duration: 2000,
    type: "success",
    position: "top-right",
  })
  data.value!.task.dataPath = null
}
// ===============
</script>

<style scoped>
:deep(.el-form-item__content) {
  justify-content: space-between;
}

:deep(.el-upload-dragger) {
  padding: 0px;
  height: 40px;
}

:deep(.el-upload-list) {
  margin: 0px;
}

:deep(.el-upload-list__item) {
  margin: 0px;
  height: 2.5rem;
}

:deep(.el-upload-dragger:hover) {
  border-color: #dedfe0;
}
</style>
