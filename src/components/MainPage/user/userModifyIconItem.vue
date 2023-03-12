<template>
  <el-dialog v-model="dialogVisible" title="修改头像" width="30rem" :before-close="send" draggable align-center>
    <el-form hide-required-asterisk status-icon :rules="rules" :model="formUser" size="large" ref="ruleFormRef" @submit.prevent>
      <el-form-item label="头像" prop="icon">
        <div flex w-full items-center>
          <el-upload action="#" :limit="1" :auto-upload="false" :drag="true" accept="image/*" ref="upload" :on-exceed="handleExceed" :on-change="handleChange" :show-file-list="false" flex-grow>
            <p text-blue>拖拽文件或点击上传</p>
          </el-upload>
          <div ml-2 flex items-center v-show="option.img !== ''">
            <el-button type="primary" @click="cancelImage">取消图片</el-button>
          </div>
        </div>
        <div v-show="option.img !== ''" class="w-full h-80 mt-5 rounded overflow-hidden">
          <vueCropper ref="cropper" :img="option.img" :outputSize="option.outputSize" :outputType="option.outputType" :canScale="option.canScale" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :canMoveBox="option.canMoveBox" :canMove="option.canMove" :centerBox="option.centerBox" :info="option.info" :fixedBox="option.fixedBox" :fixed="option.fixed" :mode="option.mode"> </vueCropper>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel(ruleFormRef)">取消</el-button>
      <el-button type="primary" @click="sumbit(ruleFormRef)">修改</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getUserInfo, updateUserIcon } from "@/api/user"
import { UserPage } from "@/stores/pages/UserPage"
import { genFileId, type FormInstance, type UploadProps, type UploadRawFile, type UploadInstance, type FormItemRule } from "element-plus"

const user = UserPage()
// === 开关diglog 使用Props和Emits作为父子组件通信[可以pinia] ===
const dialogVisible = ref<boolean>(false)
const props = defineProps<{ dialog: boolean }>()
watch(props, async () => {
  dialogVisible.value = props.dialog
})
const emit = defineEmits<{
  (e: "close-dialog", value: boolean): void
}>()
const send = () => {
  emit("close-dialog", false)
}
// ===========================================================

// === 上传文件功能 ===
const upload = ref<UploadInstance>()
const handleExceed: UploadProps["onExceed"] = files => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const handleChange: UploadProps["onChange"] = uploadFile => {
  if (uploadFile.raw) {
    let reader = new FileReader()
    reader.readAsDataURL(uploadFile.raw)
    reader.onload = e => {
      option.img = e.target?.result as string
    }
    formUser.icon = true
    ruleFormRef.value?.clearValidate()
  }
}
// ===================

//=== 图片裁剪功能 ===
const cropper = ref()
const option = reactive({
  img: "", // 裁剪图片的地址
  outputSize: 1, // 裁剪生成图片质量
  outputType: "png", // 裁剪生成图片格式
  canScale: true, // 图片是否允许滚轮播放
  autoCrop: true, // 是否默认生成截图框
  info: false, // 是否展示截图框信息
  autoCropWidth: 200, // 生成截图框的宽度
  autoCropHeight: 200, // 生成截图框的高度
  canMoveBox: false, // 截图框是否可以拖动
  fixedBox: true, // 固定截图框的大小
  canMove: true, // 上传图片是否可拖动
  centerBox: true, // 截图框限制在图片里面
  fixed: true, // 开启截图框宽高固定比例
  mode: "cover", //图片默认渲染方式
})
const cancelImage = () => {
  option.img = ""
  upload.value!.clearFiles()
  formUser.icon = false
}
// ===================

// === 表单认证 ====
const ruleFormRef = ref<FormInstance>()
const formUser = reactive({ icon: false })
const rules = reactive<{ icon: Array<FormItemRule> }>({
  icon: [
    {
      required: true,
      trigger: "blur",
      validator: (_, value, callback) => (value ? callback() : callback(new Error("未上传图片"))),
    },
    {
      required: true,
      trigger: "change",
      validator: (_, value, callback) => (value ? callback() : callback(new Error("未上传图片"))),
    },
  ],
})
const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  cancelImage()
  formEl.resetFields()
  send()
}
const sumbit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      await cropper.value.getCropBlob(async (data: Blob) => {
        const file = new File([data], "clipImage" + data.type.split("/")[1], { type: data.type })
        await updateUserIcon(file)
        cancel(formEl)
        getUserInfo().then(data => {
          user.$state = data.data
        })
        ElNotification({ message: `成功修改用户头像${user.username}`, type: "success" })
      })
    }
  })
}
// ===============
</script>

<style scoped>
:deep(.el-upload-dragger) {
  padding: 0px;
  height: 40px;
}

:deep(.el-input-group__append) {
  height: 40px;
  width: 100px;
  padding: 0;
}
</style>
