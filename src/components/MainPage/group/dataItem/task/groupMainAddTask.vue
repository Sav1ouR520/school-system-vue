<template>
  <el-dialog v-model="dialogVisible" title="添加任务" width="30rem" :before-close="send" draggable>
    <el-form hide-required-asterisk status-icon :rules="rules" :model="formTask" size="large" ref="ruleFormRef" @submit.prevent>
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="formTask.name"></el-input>
      </el-form-item>
      <el-form-item label="任务简介" prop="introduce">
        <el-input v-model="formTask.introduce" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload flex-grow ref="upload" action="#" :auto-upload="false" :disabled="!hasData" :file-list="fileList" :on-change="handleChange" :on-remove="handleRemove" multiple drag>
          <div flex justify-between :class="hasData ? 'text-blue' : ''">
            <div flex flex-grow items-center justify-center rounded-xl>
              <i-ep:upload-filled text-8.4 />
              <p>拖拽文件到此处或点击上传</p>
            </div>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div flex justify-between>
        <el-form-item label="开启上传">
          <el-radio-group v-model="hasData">
            <el-radio-button :label="true">Yes</el-radio-button>
            <el-radio-button :label="false" @click="cancelFile()">No</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <div>
          <el-button @click="cancel(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="sumbit(ruleFormRef)">确认</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { createTask } from "@/api/task"
import type { FormTask } from "@/interface/task"
import { GroupPage } from "@/stores/pages/GroupPage.js"
import { FileZip } from "@/utils/filezip"
import type { FormInstance, FormItemRule, UploadFiles, UploadInstance, UploadProps } from "element-plus"

// === 开关diglog 使用Props和Emits作为父子组件通信[可以pinia] ===
const dialogVisible = ref<boolean>(false)
const props = defineProps<{ dialog: boolean }>()
watch(props, () => {
  dialogVisible.value = props.dialog
})
const emit = defineEmits<{
  (e: "close-dialog", value: boolean): void
  (e: "add-task"): void
}>()
const send = () => {
  emit("close-dialog", false)
}
// ===========================================================

// === 文件上传 ===
const hasData = ref<Boolean>(false)
const upload = ref<UploadInstance>()
const fileList = ref<UploadFiles>([])
const handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  fileList.value = uploadFiles
}

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  fileList.value = uploadFiles
}

// ===============

// === 表单认证 ====
const page = GroupPage()
const formTask = reactive<FormTask>({ name: "", introduce: "", groupId: page.group.id, file: new Blob() })
const ruleFormRef = ref<FormInstance>()
type FormTaskRule = {
  [k in keyof FormTask]?: Array<FormItemRule>
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

const cancelFile = () => {
  upload.value!.clearFiles()
}

const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  cancelFile()
  formEl.resetFields()
  hasData.value = false
  formTask.file = new Blob()
  send()
  emit("add-task")
}

const sumbitAction = async (formEl: FormInstance) => {
  await createTask(formTask, hasData.value && fileList.value.length !== 0)
  ElNotification({
    title: "成功",
    message: `成功创建任务${formTask.name}`,
    duration: 2000,
    type: "success",
    position: "top-right",
  })
  cancel(formEl)
}

const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      if (hasData && fileList.value.length !== 0) {
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
// ===============
</script>

<style scoped>
:deep(.el-form-item--large) {
  margin-bottom: 1.5rem;
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
