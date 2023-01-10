<template>
  <indexItem :title="switchform.title">
    <template v-slot:form>
      <!-- <keep-alive :include="['loginForm', 'registerForm']"> -->
        <loginForm v-if="switchform.url === 'login'"></loginForm>
        <registerForm v-else-if="switchform.url === 'register'"></registerForm>
      <!-- </keep-alive> -->
    </template>
    <template v-slot:info>
      <div text-sm flex>
        <p m-0>{{ switchform.info }}</p>
        <a text-center text-blue-400 cursor-pointer @click="change()">{{ switchform.urlInfo }}</a>
      </div>
    </template>
  </indexItem>
</template>

<script setup lang="ts">
import { SwitchForm } from "@/stores/SwitchForm"
import { Captcha } from '@/stores/Captcha'
const captcha = Captcha()
const switchform = SwitchForm()
switchform.setForm("login")
const change = () => {
  if (switchform.url === "login") {
    switchform.setForm("register")
  } else if (switchform.url === "register") {
    switchform.setForm("login")
  }
  captcha.reset()
}

onBeforeMount(() => {
  captcha.reset()
})
</script>
