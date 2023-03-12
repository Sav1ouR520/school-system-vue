<template>
  <el-form @submit.prevent :rules="rules" hide-required-asterisk ref="ruleFormRef" :model="user" label-position="top" size="large">
    <el-form-item label="账号" prop="account">
      <el-input v-model="user.account" placeholder="请输入">
        <template #prefix>
          <i-ep-message></i-ep-message>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="user.password" placeholder="请输入密码" type="password" show-password>
        <template #prefix>
          <i-ep-lock></i-ep-lock>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="captcha" :error="captcha.codeErrorMeg">
      <el-input class="no-radius" v-model="user.captcha" placeholder="请输入验证码" maxlength="4" @keyup.enter="sumbit(ruleFormRef)">
        <template #append>
          <img @click="captcha.reset()" :src="captcha.url" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="sumbit(ruleFormRef)">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { login } from "@/api/user"
import type { LoginUser } from "@/interface/user"
import { Captcha } from "@/stores/Captcha.js"
import type { FormInstance, FormItemRule } from "element-plus"

// === 表单验证 ===
const router = useRouter()
const captcha = Captcha()
const ruleFormRef = ref<FormInstance>()
const user = reactive<LoginUser>({
  account: "",
  password: "",
  captcha: "",
})
type LoginUserRule = {
  [k in keyof LoginUser]?: Array<FormItemRule>
}
const rules = reactive<LoginUserRule>({
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
  ],
})

const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      const data = await login(user)
      ElMessage({ message: data.message, type: data.action ? "success" : "error" })
      if (data.action) {
        router.push({ name: "main" })
      } else {
        captcha.reset()
      }
    }
  })
}
// ===============
</script>

<style scoped>
.el-form-item {
  font-weight: 700;
  margin-top: 1rem;
}

.no-radius :deep(.el-input__wrapper) {
  border-radius: 0px;
}

.el-button {
  width: 100%;
  border-radius: 9999rem;
}

:deep(.el-input__wrapper) {
  border-radius: 9999rem;
}

:deep(.el-input-group__append) {
  height: 40px;
  width: 100px;
  padding: 0;
}
</style>
