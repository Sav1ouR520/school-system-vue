<template>
  <loginRegistrationItem :title="switchform.title">
    <template v-slot:form>
        <loginForm v-if="switchform.url === 'login'"></loginForm>
        <registerForm v-else-if="switchform.url === 'register'"></registerForm>
    </template>
    <template v-slot:info>
      <div text-sm flex>
        <p m-0>{{ switchform.info }}</p>
        <a text-center text-blue-400 cursor-pointer @click="change()">{{ switchform.urlInfo }}</a>
      </div>
    </template>
  </loginRegistrationItem>
</template>

<script setup lang="ts">
import { SwitchForm } from "@/stores/SwitchForm"
const switchform = SwitchForm()
switchform.setForm("login")
const change = () => {
  if (switchform.url === "login") {
    switchform.setForm("register")
  } else if (switchform.url === "register") {
    switchform.setForm("login")
  }
}
</script>
