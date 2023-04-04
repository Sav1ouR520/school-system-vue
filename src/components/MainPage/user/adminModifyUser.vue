<template>
  <el-dialog v-model="dialogVisible" title="修改用户信息" width="30rem" :before-close="send" draggable align-center>
    <el-form hide-required-asterisk status-icon :rules="rules" :model="formUser" size="large" ref="ruleFormRef" @submit.prevent>
      <el-form-item label="名称" prop="username">
        <el-input :disabled="page.id === props.userId" v-model="formUser.username" placeholder="请输入新名称">
          <template #prefix>
            <i-ep-user></i-ep-user>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="头像">
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
      <div flex justify-between>
        <div flex>
          <div mr-4>
            <span text-sm mr-3 text-gray-700>状态</span>
            <el-switch :disabled="page.id === props.userId" v-model="formUser.status" inline-prompt active-text="正常" inactive-text="封禁" />
          </div>
          <div>
            <span text-sm mr-3 text-gray-700>权限</span>
            <el-switch :disabled="page.id === props.userId" v-model="formUser.role" inline-prompt active-value="admin" inactive-value="user" active-text="管理" inactive-text="普通" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #409eff" />
          </div>
        </div>
        <div>
          <el-button @click="cancel(ruleFormRef)">取消</el-button>
          <el-button type="primary" v-if="page.id !== props.userId" @click="sumbit(ruleFormRef)">修改</el-button>
          <el-button type="primary" v-else @click="cancel(ruleFormRef)">确认</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { adminGetUserInfo, adminUpdateUser } from "@/api/user"
import type { UpdataUser } from "@/interface/user"
import { UserPage } from "@/stores/pages/UserPage"
import { genFileId, type FormInstance, type UploadProps, type UploadRawFile, type UploadInstance, type FormItemRule } from "element-plus"

// === 开关diglog 使用Props和Emits作为父子组件通信[可以pinia] ===
const dialogVisible = ref<boolean>(false)
const props = defineProps<{ dialog: boolean; userId: string }>()
watch(props, async () => {
  dialogVisible.value = props.dialog
  if (dialogVisible.value) {
    formUser.id = props.userId
    adminGetUserInfo(props.userId)
      .then(data => {
        formUser.username = data.data.username
        formUser.status = data.data.status
        formUser.role = data.data.role
      })
      .catch(() => {
        location.reload()
        ElNotification({ message: `你没有足够的权限`, type: "error" })
      })
  }
})
const emit = defineEmits<{
  (e: "close-dialog", value: boolean): void
}>()
const send = () => {
  emit("close-dialog", false)
}
// ===========================================================

// === 获取用户信息 ===
const page = UserPage()
// ===================

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
}
// ===================

// === 表单认证 ====
const ruleFormRef = ref<FormInstance>()
const formUser = reactive<UpdataUser>({ id: "", username: "unkown", status: true, role: "user" })
const checkUsername = (value: string, callback: any) => {
  if (value.length < 6) {
    callback(new Error("名称长度不能少于6位"))
  } else if (value.length > 20) {
    callback(new Error("名称长度超过于20位"))
  } else {
    callback()
  }
}
const rules = reactive<{ username: Array<FormItemRule> }>({
  username: [
    { required: true, message: "请输入新名称", trigger: "blur" },
    { required: true, message: "请输入新名称", trigger: "change" },
    { required: true, trigger: "change", validator: (_, value, callback) => checkUsername(value, callback) },
    { required: true, trigger: "blur", validator: (_, value, callback) => checkUsername(value, callback) },
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
      if (option.img !== "") {
        await cropper.value.getCropBlob(async (data: Blob) => {
          const file = new File([data], "clipImage" + data.type.split("/")[1], { type: data.type })
          await adminUpdateUser(formUser, file)
        })
      }
      adminUpdateUser(formUser)
        .then(() => ElNotification({ message: `成功修改用户信息`, type: "success" }))
        .catch(() => ElNotification({ message: `修改用户信息失败`, type: "error" }))
        .finally(() => cancel(formEl))
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
