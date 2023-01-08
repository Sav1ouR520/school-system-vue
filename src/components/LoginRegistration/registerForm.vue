<template>
  <el-form :rules="rules" status-icon ref="ruleFormRef" :model="user" size="large" label-position="top" scroll-to-error>
    <el-form-item label="账号" prop="account">
      <el-input v-model="user.account" placeholder="请输入账号" maxlength="20" prefix-icon="User" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="user.password" placeholder="请输入密码" type="password" maxlength="30" prefix-icon="Lock" />
    </el-form-item>
    <el-form-item label="确认密码" prop="repassword">
      <el-input v-model="user.repassword" placeholder="再输入一次密码" type="password" maxlength="30" prefix-icon="Lock" />
    </el-form-item>
    <el-form-item label="验证码" prop="captcha" :error="codeErrorMeg">
      <div flex flex-grow>
        <el-input class="no-radius" v-model="user.captcha" placeholder="请输入验证码" maxlength="4" />
        <img @click="resetCode" :src="codeUrl">
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="sumbit(ruleFormRef)">注册账号</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { checkAccountAvailable, register } from "@/api/user"
import type { registerUser, registerUserRule } from "@/interface/user.js"
import type { FormInstance } from "element-plus"
import { SwitchForm } from "@/stores/SwitchForm.js"
const switchform = SwitchForm()
const ruleFormRef = ref<FormInstance>()
const user = reactive<registerUser>({
  account: "",
  password: "",
  repassword: "",
  captcha: ""
})
const resetCode = () => codeUrl.value = codeUrl.value + '?' + Math.random()
const codeErrorMeg = ref<string>()
const codeUrl = ref<string>('/api/captcha')
const accountInfo = { account: "", message: "" }
const checkAvailable = useDebounceFn((value, callback) => {
  checkAccountAvailable(value).then((res) => {
    if (res.data.available) {
      accountInfo.message = ""
      callback()
    } else {
      accountInfo.message = res.message
      callback(new Error(res.message))
    }
  })
}, 1000)
const checkAccount = (value: any, callback: any) => {
  const re = new RegExp(/^\w{6,20}$/)
  if (re.test(value)) {
    if (accountInfo.account != value) {
      accountInfo.account = value;
      checkAvailable(value, callback)
    } else {
      accountInfo.message ? callback(new Error(accountInfo.message)) : callback()
    }
  } else {
    callback(new Error("账号只能由5-20位数字或英文字母以及下划线组成"))
  }
}
const checkPassword = (value: any, callback: any) => {
  const re = new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9~!@&%#_]{8,30}$/)
  if (!re.test(value)) {
    callback(new Error("密码需要由至少8位大小写、数字组合"))
  } else {
    callback()
  }
}
const checkRePassword = (value: any, callback: any) => {
  if (value !== user.password) {
    callback(new Error("两次密码不一致"))
  } else {
    callback()
  }
}
const rules = reactive<registerUserRule>({
  account: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { required: true, message: "请输入用户名", trigger: "change" },
    { required: true, trigger: "blur", validator: (_, value, callback) => checkAccount(value, callback) },
    { required: true, trigger: "change", validator: (_, value, callback) => checkAccount(value, callback) }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { required: true, message: "请输入密码", trigger: "change" },
    { required: true, trigger: "change", validator: (_, value, callback) => checkPassword(value, callback) },
    { required: true, trigger: "blur", validator: (_, value, callback) => checkPassword(value, callback) }
  ],
  repassword: [
    { required: true, message: "请再输入一次密码", trigger: "blur" },
    { required: true, message: "请再输入一次密码", trigger: "change" },
    { required: true, trigger: "change", validator: (_, value, callback) => checkRePassword(value, callback) },
    { required: true, trigger: "blur", validator: (_, value, callback) => checkRePassword(value, callback) },
  ],
  captcha: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { required: true, message: "请输入验证码", trigger: "change" },
  ]
})
const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  setTimeout(() => { codeErrorMeg.value = '' }, 0)
  formEl.validate(async (valid) => {
    if (valid) {
      const data = await register({ account: user.account, password: user.password, captcha: user.captcha })
      if (data.data['validation']) {
        ElMessage({ message: data.message, type: 'success' })
        switchform.setForm("login")
      } else {
        codeErrorMeg.value = data.message
      }
    }
    resetCode()
  })
}
</script>

<style scoped>
.el-form-item {
  font-weight: 700;
  margin-top: 1rem;
}

.no-radius :deep(.el-input__wrapper) {
  border-radius: 0px
}

.el-button {
  width: 100%;
  border-radius: 9999rem;
  margin-top: 1rem;
}

:deep(.el-input__wrapper) {
  border-radius: 9999rem;
}
</style>
