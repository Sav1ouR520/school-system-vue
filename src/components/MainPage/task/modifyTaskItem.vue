<template>
  <div flex items-center m-2 mt-0 h-10>
    <div flex items-center flex-grow font-bold text-2xl h-8>群任务</div>
    <div flex items-center text-xs px-1 ml-2 h-8 border-2 bg-black rounded text-white>
      <span>创建者:</span>
      <span font-bold>{{ data!.member.name }}</span>
    </div>
    <div flex items-center text-xs px-1 ml-2 h-8 border-2 bg-black rounded text-white>
      <span>时间:</span>
      <span font-bold>{{ moment(data!.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
    </div>
  </div>
  <hr border-b-2 m-2 mb-4 />
  <el-form mx-2 hide-required-asterisk status-icon :rules="rules" :model="formTask" ref="ruleFormRef" @submit.prevent>
    <div flex items-center justify-center text-xs mb-4 h-8 border-2 bg-gray rounded text-white>
      <span mr-1>标识:</span>
      <span font-bold>[{{ data!.id }}]</span>
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
      <div v-if="data!.dataPath">
        <el-button @click="downloadFile()" type="primary" plain>下载</el-button>
        <el-button @click="deleteFile()" type="danger" plain>删除</el-button>
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
</template>

<script setup lang="ts">
import { findtaskInfoByTaskId, modifyTask, deleteTaskFile } from "@/api/task"
import type { FormInstance, FormItemRule, UploadFiles, UploadInstance, UploadProps } from "element-plus"
import moment from "moment"

import type { ModifyTask, Task } from "@/interface/task"
import { FileZip } from "@/utils/filezip"
import { TaskPage } from "@/stores/pages/TaskPage"
import { GroupPage } from "@/stores/pages/GroupPage"

// === 查找task信息 ===
const task = TaskPage()
const group = GroupPage()
const getData = () => {
  let request = null
  if (routerName === "task") {
    request = findtaskInfoByTaskId(task.id).then(items => (data.value = items.data as Task))
  } else {
    request = findtaskInfoByTaskId(group.click.id).then(items => (data.value = items.data as Task))
  }
  request
    .then(() => {
      formTask.id = data.value!.id
      formTask.name = data.value!.name
      formTask.introduce = data.value!.introduce
      formTask.file = new Blob()
    })
    .catch(async () => {
      router.push("/main/group")
      group.update = { time: new Date().valueOf(), type: "all" }
      ElNotification({ message: `权限不足/任务不存在`, type: "error" })
    })
}

// === 获取router信息 ===
const router = useRouter()
const routerName = router.currentRoute.value.name
const clickid = ref()
if (routerName === "task") {
  clickid.value = task.id
} else if (routerName === "groupTask") {
  clickid.value = group.click.id
}
// =====================
const data = ref<Task>({
  id: "",
  name: "",
  introduce: "",
  memberId: "",
  groupId: "",
  activeStatue: true,
  dataPath: null,
  createTime: new Date(),
  member: { id: "", name: "", groupId: "", userId: "", role: "admin", joinTime: new Date(), icon: "" },
})
// ===================

// === 监听数据变化 ===
task.$subscribe(
  async (mutation, state) => {
    if (state.type === "modify" && clickid.value !== state.id) {
      clickid.value = task.id
      getData()
    }
  },
  { detached: true, deep: true },
)
group.$subscribe(
  async (mutation, state) => {
    if (state.click.type === "task" && state.click.status === "modify" && clickid.value !== state.click.id) {
      clickid.value = group.click.id
      getData()
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
  window.location.href = "/data/task/" + data.value!.dataPath
}
// ====================

// === 表单验证 ===
const formTask = reactive<ModifyTask>({
  id: "",
  name: "",
  introduce: "",
  file: new Blob(),
})
getData()
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

const sumbitAction = (formEl: FormInstance) => {
  modifyTask(formTask, hasData.value && fileList.value.length !== 0)
    .then(() => {
      getData()
      ElNotification({ message: `成功修改任务${formTask.name}`, type: "success" })
    })
    .catch(() => ElNotification({ message: `修改任务${formTask.name}失败`, type: "error" }))
    .finally(() => {
      if (routerName === "groupTask") {
        group.update = { time: new Date().valueOf(), type: "task" }
      }
      task.time = new Date().valueOf()
      cancel(formEl)
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
  await deleteTaskFile(data.value!.id)
  getData()
  ElNotification({ message: `成功移除${formTask.name}的文件`, type: "success" })
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
