<template>
  <div flex items-center m-2 mt-0 h-10>
    <div font-bold text-2xl flex-grow>任务名: {{ data!.task.name }}</div>
    <div flex items-center text-2 px-2 h-8 border-2 :class="data!.File?'bg-green':'bg-black'" rounded text-white>
      <span font-bold>{{ data!.File ? "完成" : "未完成" }}</span>
    </div>
  </div>
  <hr border-b-2 m-2 mb-4 />
  <div flex flex-col mx-2>
    <div flex items-center text-2 px-2 h-10 border-2 rounded mb-4>
      <span w-15>创建者:</span>
      <span font-bold flex-grow>{{ data!.task.member.name }}</span>
    </div>
    <div flex text-2 border-2 rounded mb-4>
      <span w-15 mt-2.5 ml-2>任务简介:</span>
      <textarea w-full ml-2 mt-2.5 min-h-6.5 h-40 font-bold focus:outline-none disabled bg-white :value="data!.task.introduce " />
    </div>
    <div flex w-full>
      <div flex items-center pl-2 text-2 h-10 border-2 rounded mb-4 mr-4 class="w-1/3" v-if="data!.task.dataPath !== null">
        <span w-15>前置材料:</span>
        <span font-bold>
          <el-button type="primary" text @click="downloadPreFile()">点击下载</el-button>
        </span>
      </div>
      <div flex items-center px-2 text-2 h-10 border-2 rounded mb-4 flex-grow>
        <span w-15>创建时间:</span>
        <span font-bold>{{ moment(data!.task.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
      </div>
    </div>
  </div>
  <div border-2 rounded mx-2>
    <div flex m-2 mb-4 items-center font-bold>
      <div flex-grow flex items-center>
        <span mr-1> 任务提交</span>
        <span text-1 text-blue cursor-pointer v-show="formFile.hasFile" @click="cancelFile()">[一键取消文件]</span>
      </div>
      <span v-if="data!.File" @click="downloadUploadFile()" text-1 text-blue cursor-pointer> 查看提交文件 </span>
    </div>
    <el-form :rules="rules" :model="formFile" ref="ruleFormRef" @submit.prevent>
      <el-form-item prop="hasFile" mx-2>
        <el-upload flex flex-col mt-2 flex-grow action="#" ref="upload" :file-list="fileList" :on-change="handleChange" :on-remove="handleRemove" :auto-upload="false" multiple drag>
          <div flex justify-between text-blue>
            <div flex flex-grow items-center justify-center rounded-xl>
              <i-ep:upload-filled text-8.4 />
              <p>拖拽文件到此处或点击上传</p>
            </div>
          </div>
        </el-upload></el-form-item
      >
      <div flex items-center m-2 h-10>
        <el-button type="primary" w-full @click="sumbit(ruleFormRef)">提交 / 修改</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { modifyFile, uploadFile } from "@/api/file"
import { findTaskByTaskId } from "@/api/task"
import { GroupPage } from "@/stores/pages/GroupPage"
import { FileZip } from "@/utils/filezip"
import type { FormInstance, FormItemRule, UploadFiles, UploadInstance, UploadProps } from "element-plus"
import moment from "moment"

// === 获取数据 ===
const page = GroupPage()
const refreshData = async () => (await findTaskByTaskId(page.click.id)).data
const data = ref(await refreshData())

const downloadPreFile = () => {
  window.location.href = "/data/task/" + data.value!.task.dataPath
}
const downloadUploadFile = () => {
  window.location.href = "/data/file/" + data.value!.File.filePath
}
// ===============

// === 监听数据变化 ===
const clickid = ref(page.click.id)
page.$subscribe(
  async (mutation, state) => {
    if (state.click.type === "task" && state.click.status === "add" && clickid.value !== state.click.id) {
      clickid.value = page.click.id
      data.value = await refreshData()
    }
  },
  { detached: true, deep: true },
)
// ===============

// === 文件上传 ===
const upload = ref<UploadInstance>()
const fileList = ref<UploadFiles>([])

const handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  fileList.value = uploadFiles
  formFile.hasFile = true
  ruleFormRef.value?.validateField("hasFile")
}
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  fileList.value = uploadFiles
  if (uploadFiles.length === 0) {
    formFile.hasFile = false
  }
  ruleFormRef.value?.validateField("hasFile")
}

const cancelFile = () => {
  upload.value!.clearFiles()
  formFile.hasFile = false
  uploadFrom.file = new Blob()
}
// =============

// === 表单认证 ===
const uploadFrom = reactive({
  id: data.value!.File ? data.value!.File.id : "",
  taskId: data.value!.task.id,
  file: new Blob(),
})
const formFile = reactive({ hasFile: false })
const ruleFormRef = ref<FormInstance>()
const rules = reactive<{ hasFile: Array<FormItemRule> }>({
  hasFile: [
    {
      required: true,
      trigger: "blur",
      validator: (_, value, callback) => (value ? callback() : callback(new Error("未上传文件"))),
    },
    {
      required: true,
      trigger: "change",
      validator: (_, value, callback) => (value ? callback() : callback(new Error("未上传文件"))),
    },
  ],
})

const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      const files: File[] = []
      fileList.value.forEach(val => {
        if (val.raw) files.push(val.raw)
      })
      uploadFrom.file = await FileZip(files)
      if (data.value?.File) {
        await modifyFile(uploadFrom)
      } else {
        await uploadFile({ taskId: uploadFrom.taskId, file: uploadFrom.file })
      }
      data.value = await refreshData()
      page.update = { time: new Date(data.value!.File.uploadTime).valueOf(), type: "task" }
      ElNotification({
        title: "成功",
        message: `成功提交文件`,
        duration: 2000,
        type: "success",
        position: "top-right",
      })
      cancelFile()
    }
  })
}
// ==============
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
