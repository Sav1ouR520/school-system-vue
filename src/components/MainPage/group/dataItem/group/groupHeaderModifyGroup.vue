<template>
  <el-dialog v-model="dialogVisible" title="修改组" width="30rem" :before-close="send" draggable align-center>
    <el-form hide-required-asterisk status-icon :rules="rules" :model="formGroup" size="large" ref="ruleFormRef"
      @submit.prevent>
      <div flex>
        <el-form-item label="组名" prop="name">
          <el-input v-model="formGroup.name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="组长" ml-4 flex-grow>
          <el-select v-model="formGroup.owner" placeholder="[组长转交可选项]">
            <el-option v-for="member in members" :key="member.id" :label="member.name" :value="member.userId" />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="头像">
        <div flex w-full items-center>
          <el-upload action="#" :limit="1" :auto-upload="false" :drag="true" accept="image/*" ref="upload"
            :on-exceed="handleExceed" :on-change="handleChange" :show-file-list="false" flex-grow>
            <p text-blue>拖拽文件或点击上传['可选']</p>
          </el-upload>
          <div ml-2 flex items-center v-show="option.img !== ''">
            <el-button type="primary" @click="cancelImage">取消图片</el-button>
          </div>
        </div>
        <div v-show="option.img !== ''" class="w-full h-80 mt-5 rounded overflow-hidden">
          <vueCropper ref="cropper" :img="option.img" :outputSize="option.outputSize" :outputType="option.outputType"
            :canScale="option.canScale" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight" :canMoveBox="option.canMoveBox" :canMove="option.canMove"
            :centerBox="option.centerBox" :info="option.info" :fixedBox="option.fixedBox" :fixed="option.fixed"
            :mode="option.mode"> </vueCropper>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div flex justify-between>
        <div>
          <el-button type="danger" @click="remove()">删除组</el-button>
        </div>
        <div>
          <el-button @click="cancel(ruleFormRef)">取消修改</el-button>
          <el-button type="primary" @click="sumbit(ruleFormRef)">确认修改</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { deleteGroup, modifyGroup } from "@/api/group"
import { findMemberByGroupId } from "@/api/member"
import type { GroupMember } from "@/interface/member"
import { GroupPage } from "@/stores/pages/GroupPage"
import { TaskPage } from "@/stores/pages/TaskPage"
import { genFileId, type FormInstance, type FormItemRule, type UploadProps, type UploadRawFile, type UploadInstance } from "element-plus"

// === 开关diglog 使用Props和Emits作为父子组件通信[可以pinia] ===
const dialogVisible = ref<boolean>(false)
const props = defineProps<{ dialog: boolean }>()
watch(props, async () => {
  dialogVisible.value = props.dialog
  if (props.dialog) {
    page.getGroup()
    getMember()
    formGroup.value = { name: page.group.name, id: page.group.id, owner: page.group.owner }
  }
})
const emit = defineEmits<{
  (e: "close-dialog", value: boolean): void
  (e: "add-group", value: number): void
}>()
const send = () => {
  emit("close-dialog", false)
}
// ===========================================================

// === 获取数据 ===
const router = useRouter()
const page = GroupPage()
const members = ref<GroupMember[]>([])
const getMember = () => {
  findMemberByGroupId(page.group.id).then(data => (members.value = data.data as GroupMember[]))
}
// ===============

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
const reset = () => ({ id: "", name: "", owner: "" })
const formGroup = ref(reset())
const ruleFormRef = ref<FormInstance>()
const rules = reactive<{ name: Array<FormItemRule> }>({
  name: [
    { required: true, message: "组名不能为空", trigger: "blur" },
    { required: true, message: "组名不能为空", trigger: "change" },
  ],
})
const remove = () => {
  deleteGroup(page.group.id)
    .then(() => {
      ElNotification({ message: `成功删除组${formGroup.value.name}`, type: "success" })
      page.$reset()
      page.update = { time: new Date().valueOf(), type: "group" }
      router.push(`/main`)
    })
    .catch(() => ElNotification({ message: `删除组${formGroup.value.name}失败`, type: "error" }))
}
const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  cancelImage()
  formEl.resetFields()
  send()
}
const sumbitAction = (formEl: FormInstance, icon?: File) => {
  modifyGroup({ ...formGroup.value, icon })
    .then(() => {
      ElNotification({ message: `成功修改组${formGroup.value.name}`, type: "success" })
      emit("add-group", new Date().valueOf())
      page.getGroup()
      page.update = { time: new Date().valueOf(), type: "group" }
      const task = TaskPage()
      task.time = new Date().valueOf()
    }).catch(() =>
      ElNotification({ message: `修改组${formGroup.value.name}失败`, type: "error" })
    )
    .finally(() => {
      cancel(formEl)
      formGroup.value = reset()
    })
}
const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      if (option.img !== "") {
        await cropper.value.getCropBlob((data: Blob) => {
          const file = new File([data], "clipImage" + data.type.split("/")[1], { type: data.type })
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
