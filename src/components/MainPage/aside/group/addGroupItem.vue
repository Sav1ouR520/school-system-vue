<template>
  <el-dialog v-model="dialogVisible" title="添加组" width="30rem" :before-close="send" draggable>
    <el-form hide-required-asterisk status-icon :rules="rules" :model="formGroup" size="large" ref="ruleFormRef">
      <el-form-item label="头像">
        <div flex w-full>
          <el-upload action="#" :limit="1" :auto-upload="false" :drag=true accept="image/*" ref="upload"
            :on-exceed="handleExceed" :on-change="handleChange" :show-file-list=false flex-grow>
            <p text-blue>拖拽文件到此处或点击上传---['可选']</p>
          </el-upload>
          <div v-show="option.img !== ''">
            <el-button type="primary" @click="cancelImage">取消图片</el-button>
          </div>
        </div>
        <div v-show="option.img !== ''" class="w-full h-80 mt-5 rounded overflow-hidden">
          <vueCropper ref="cropper" :img="option.img" :outputSize="option.outputSize" :outputType="option.outputType"
            :canScale="option.canScale" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight" :canMoveBox="option.canMoveBox" :canMove="option.canMove"
            :centerBox="option.centerBox" :info="option.info" :fixedBox="option.fixedBox" :fixed="option.fixed"
            :mode="option.mode">
          </vueCropper>
        </div>
      </el-form-item>
      <el-form-item label="组名" prop="name">
        <el-input v-model="formGroup.name" maxlength="20"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="sumbit(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { addGroup } from "@/api/group";
import { genFileId, type FormInstance, type FormItemRule, type UploadProps, type UploadRawFile, type UploadInstance } from "element-plus"

// === 使用Props 和Emits 作为父子组件通信 ===
const dialogVisible = ref<boolean>(false)
const props = defineProps<{ dialog: boolean }>()
watch(props, () => {
  dialogVisible.value = props.dialog
})
const emit = defineEmits<{ (e: "close-dialog", value: boolean): void }>()
const send = () => {
  emit("close-dialog", false)
}
// =========================================

// === 上传文件功能 ===
const upload = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const handleChange: UploadProps['onChange'] = (uploadFile) => {
  if (uploadFile.raw) {
    let reader = new FileReader()
    reader.readAsDataURL(uploadFile.raw)
    reader.onload = e => {
      option.img = e.target?.result as string
    }
  }
}
// ===================

//=== 图片裁剪功能 ===
const cropper = ref()
const option = reactive({
  img: '', // 裁剪图片的地址
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
  mode: "cover" //图片默认渲染方式
})
const cancelImage = () => {
  option.img = ''
  upload.value!.clearFiles()
}
// ===================

// === 表单认证 ====
const formGroup = reactive({ name: "" })
const ruleFormRef = ref<FormInstance>()
const rules = reactive<{ name: Array<FormItemRule> }>({
  name: [
    { required: true, message: "组名不能为空", trigger: "blur" },
    { required: true, message: "组名不能为空", trigger: "change" },
  ],
})
const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  cancelImage()
  formEl.resetFields()
  send()
}
const sumbitAction = (formEl: FormInstance, icon?: File) => {
  addGroup({ name: formGroup.name, icon })
  ElNotification({
    title: '成功',
    message: `成功创建组${formGroup.name}`,
    duration: 2000,
    type: 'success',
    position: 'top-right',
  })
  cancel(formEl)
}
const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      if (option.img !== "") {
        await cropper.value.getCropBlob((data: Blob) => {
          const file = new File([data], 'clipImage' + data.type.split('/')[1], { type: data.type })
          sumbitAction(formEl, file)
        })
      } else {
        sumbitAction(formEl)
      }
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
</style>
