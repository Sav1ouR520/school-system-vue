<template>
  <el-form :rules="rules" status-icon ref="ruleFormRef" :model="user" size="large" label-position="top" >
    <el-form-item label="邮箱" prop="account" :error="captcha.emailErrorMeg">
      <el-input v-model="user.account" placeholder="使用邮箱注册" maxlength="20" prefix-icon="User">
        <template #append>
          <a cursor-pointer no-underline text-blue-500 @click.prevent="send()" >{{ captcha.getCode }}</a>
        </template>
      </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha" :error="captcha.codeErrorMeg" flex-grow>
        <el-input class="no-radius" v-model.number="user.captcha" placeholder="请输入验证码" maxlength="4" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="user.password" placeholder="密码需要由至少8位大小写、数字组合" type="password" maxlength="30" prefix-icon="Lock" />
    </el-form-item>
    <el-form-item label="确认密码" prop="repassword">
      <el-input v-model="user.repassword" placeholder="再输入一次密码" type="password" maxlength="30" prefix-icon="Lock" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="sumbit(ruleFormRef)">注册账号</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { checkAccountAvailable, register } from "@/api/user"
import type { registerUser, registerUserRule } from "@/interface/user"
import type {FormInstance }from "element-plus"
import { sendCode } from "@/api/email"
import { SwitchForm } from "@/stores/SwitchForm"
import { Captcha } from '@/stores/Captcha'

const captcha = Captcha()
const switchform = SwitchForm()
const ruleFormRef = ref<FormInstance>()
const initialState = () => ({
  account: "",
  password: "",
  repassword: "",
  captcha: ""
})
const user = reactive<registerUser>(initialState())
const accountInfo = { account: "", message: "" }

const send = async () => {
  const res = await ruleFormRef.value?.validateField('account')
  if (res) {
    if (captcha.leftTime <= 0){
    sendCode(user.account)
      captcha.countDown()
    } else {
      captcha.emailErrorMeg = `还需等待${captcha.leftTime}s,才能重新发送验证码`
      setTimeout(() => { captcha.emailErrorMeg =""},1000)
    }
  }
}

const checkAvailable = useDebounceFn((value: any, callback: Function) => {
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
  const re = new RegExp(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)
  if (re.test(value)) {
    if (accountInfo.account != value) {
      accountInfo.account = value;
      checkAvailable(value, callback)
    } else {
      accountInfo.message ? callback(new Error(accountInfo.message)) : callback()
    }
  } else {
    callback(new Error("不是邮箱格式"))
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
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { required: true, message: "请输入邮箱", trigger: "change" },
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
  setTimeout(() => { captcha.codeErrorMeg = '' }, 0)
  formEl.validate(async (valid) => {
    if (valid) {
      const data = await register(user)
      if (data.data['validation']) {
        ElMessage({ message: data.message, type: 'success' })
        // Object.assign(user, initialState());
        switchform.setForm("login")
      } else {
        captcha.codeErrorMeg = data.message
      }
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
  margin-top: 1rem;
}
</style>
