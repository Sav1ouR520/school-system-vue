<template>
  <el-dialog v-model="dialogVisible" title="修改名称" width="30rem" :before-close="send" draggable align-center>
    <el-form hide-required-asterisk status-icon :rules="rules" :model="formUser" size="large" ref="ruleFormRef" @submit.prevent>
      <el-form-item label="名称" prop="username">
        <el-input v-model="formUser.username" placeholder="请输入新名称">
          <template #prefix>
            <i-ep-user></i-ep-user>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel(ruleFormRef)">取消</el-button>
      <el-button type="primary" @click="sumbit(ruleFormRef)">修改</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getUserInfo, updateUserUsername } from "@/api/user"
import { UserPage } from "@/stores/pages/UserPage"
import type { FormInstance, FormItemRule } from "element-plus"

const user = UserPage()

// === 开关diglog 使用Props和Emits作为父子组件通信[可以pinia] ===
const dialogVisible = ref<boolean>(false)
const props = defineProps<{ dialog: boolean }>()
watch(props, async () => {
  dialogVisible.value = props.dialog
  if (props.dialog) {
    formUser.username = user.username
  }
})
const emit = defineEmits<{
  (e: "close-dialog", value: boolean): void
}>()
const send = () => {
  emit("close-dialog", false)
}
// ===========================================================

// === 表单认证 ====
const formUser = reactive({ username: "" })
const ruleFormRef = ref<FormInstance>()
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
  formEl.resetFields()
  send()
}
const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      updateUserUsername(formUser)
        .then(() => ElNotification({ message: `成功修改用户名称`, type: "success" }))
        .catch(() => ElNotification({ message: `修改用户名称失败`, type: "error" }))
        .finally(() => {
          cancel(formEl)
          getUserInfo().then(data => {
            user.$state = data.data
          })
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
