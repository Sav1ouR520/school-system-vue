<template>
  <el-form :rules="rules" hide-required-asterisk ref="ruleFormRef" :model="user" label-position="top" size="large">
    <el-form-item label="账号" prop="account">
      <el-input v-model="user.account" placeholder="请输入" prefix-icon="User" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="user.password" placeholder="请输入密码" type="password" prefix-icon="Lock" show-password />
    </el-form-item>
    <el-form-item label="验证码" prop="captcha" :error="captcha.codeErrorMeg">
      <div flex flex-grow>
        <el-input class="no-radius" v-model="user.captcha"  placeholder="请输入验证码" maxlength="4" />
        <img @click="captcha.reset()" :src="captcha.url">
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="sumbit(ruleFormRef)">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { login } from "@/api/user"
import type { loginUser, loginUserRule } from "@/interface/user.js"
import { Captcha } from '@/stores/Captcha'
import type { FormInstance } from "element-plus";
const captcha = Captcha()
const ruleFormRef = ref<FormInstance>()
const user = reactive<loginUser>({
  account: "",
  password: "",
  captcha: ""
})
const rules = reactive<loginUserRule>({
  account: [
    { required: true, message: "没有输入账号", trigger: "blur" },
    { required: true, message: "没有输入账号", trigger: "change" },
  ],
  password: [
    { required: true, message: "没有输入密码", trigger: "blur" },
    { required: true, message: "没有输入密码", trigger: "change" },
  ],
  captcha: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { required: true, message: "请输入验证码", trigger: "change" },
  ]
})

const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const data = await login(user)
      ElMessage({ message: data.message, type: data.data.validation ? 'success' : 'error' })
      captcha.reset()
    }
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
}

:deep(.el-input__wrapper) {
  border-radius: 9999rem;
}
</style>
