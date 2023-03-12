<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="30rem" :before-close="send" draggable align-center>
    <el-form hide-required-asterisk status-icon :rules="rules" :model="formUser" size="large" ref="ruleFormRef" @submit.prevent>
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="formUser.oldPassword" placeholder="请输入旧的密码" type="password" maxlength="30">
          <template #prefix>
            <i-ep-lock></i-ep-lock>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="formUser.newPassword" placeholder="密码需要由至少8位大小写、数字组合" type="password" maxlength="30">
          <template #prefix>
            <i-ep-lock></i-ep-lock>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="再确认" prop="newRepassword">
        <el-input v-model="formUser.newRepassword" placeholder="再输入一次密码" type="password" maxlength="30" @keyup.enter="sumbit(ruleFormRef)">
          <template #prefix>
            <i-ep-lock></i-ep-lock>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha" :error="captcha.codeErrorMeg">
        <el-input class="no-radius" v-model="formUser.captcha" placeholder="请输入验证码" maxlength="4" @keyup.enter="sumbit(ruleFormRef)">
          <template #append>
            <img @click="captcha.reset()" :src="captcha.url" />
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
import { updateUserPassword } from "@/api/user"
import type { ModifyUserPassWord } from "@/interface/user"
import { Captcha } from "@/stores/Captcha"
import type { FormInstance, FormItemRule } from "element-plus"


// === 开关diglog 使用Props和Emits作为父子组件通信[可以pinia] ===
const dialogVisible = ref<boolean>(false)
const props = defineProps<{ dialog: boolean }>()
watch(props, async () => {
  dialogVisible.value = props.dialog
  if (props.dialog) {
    captcha.reset()
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
const checkPassword = (value: any, callback: any) => {
  const re = new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9~!@&%#_]{8,30}$/)
  if (!re.test(value)) {
    callback(new Error("密码需要由至少8位大小写、数字组合"))
  } else {
    callback()
  }
}
const checkRePassword = (value: any, callback: any) => {
  if (value !== formUser.newPassword) {
    callback(new Error("两次密码不一致"))
  } else {
    callback()
  }
}
const formUser = reactive<ModifyUserPassWord>({ captcha: "", oldPassword: "", newPassword: "", newRepassword: "" })
const ruleFormRef = ref<FormInstance>()
type ModifyUserRule = {
  [k in keyof ModifyUserPassWord]?: Array<FormItemRule>
}
const rules = reactive<ModifyUserRule>({
  oldPassword: [
    { required: true, message: "请输入旧密码", trigger: "blur" },
    { required: true, message: "请输入旧密码", trigger: "change" },
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { required: true, message: "请输入新密码", trigger: "change" },
    { required: true, trigger: "change", validator: (_, value, callback) => checkPassword(value, callback) },
    { required: true, trigger: "blur", validator: (_, value, callback) => checkPassword(value, callback) },
  ],
  newRepassword: [
    { required: true, message: "请再输入一次新密码", trigger: "blur" },
    { required: true, message: "请再输入一次新密码", trigger: "change" },
    { required: true, trigger: "change", validator: (_, value, callback) => checkRePassword(value, callback) },
    { required: true, trigger: "blur", validator: (_, value, callback) => checkRePassword(value, callback) },
  ],
  captcha: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { required: true, message: "请输入验证码", trigger: "change" },
  ],
})
const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  send()
}
const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  setTimeout(() => {
    captcha.codeErrorMeg = ""
  }, 0)
  formEl.validate(async valid => {
    if (valid) {
      const data = await updateUserPassword(formUser)
      if (data.action) {
        cancel(formEl)
        ElNotification({ message: `成功修改用户密码`, type: "success" })
      } else {
        captcha.codeErrorMeg = data.message
        captcha.reset()
      }
    }
  })
}
// ===============

// === 验证码 ===
const captcha = Captcha()
// ==============
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
