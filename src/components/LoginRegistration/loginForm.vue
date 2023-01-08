<template>
  <el-form :rules="rules" hide-required-asterisk ref="ruleFormRef" :model="formInline" label-position="top"
    size="large">
    <el-form-item label="账号" prop="account">
      <el-input v-model="formInline.account" placeholder="请输入账号" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="formInline.password" placeholder="请输入密码" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="sumbit(ruleFormRef)">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { login } from "@/api/user"
import type { loginUser, loginUserRule } from "@/interface/user.js"
import type { FormInstance } from "element-plus"

// defineProps<{ url: string }>()
const ruleFormRef = ref<FormInstance>()
const formInline = reactive<loginUser>({
  account: "",
  password: "",
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
})

const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const data = await login(formInline)
      ElMessage({ message: data.message, type: data["data"] ? 'success' : 'error' })
    }
  })
}
</script>

<style scoped>
.el-form-item {
  font-weight: 700;
  margin-top: 2.75rem;
}

.el-button {
  width: 100%;
  border-radius: 9999rem;
  margin-top: 2.75rem;
}

:deep(.el-input__wrapper) {
  border-radius: 9999rem;
}
</style>
