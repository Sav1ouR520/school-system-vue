<template>
  <el-page-header @back="jump()" p-4 border-2 rounded-xl bg-white h-25>
    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(path, index) in paths" :key="index">{{ path[0].toUpperCase() + path.slice(1) }}</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <template #content>
      <div flex items-center>
        <span font-bold>用户信息</span>
      </div>
    </template>
    <template #extra>
      <el-button type="info"  @click="logout">登出</el-button>
      <el-button type="primary" @click="addOpen()">修改密码</el-button>
      <userModifyPassWordItem :dialog="modifyDialogVisible" @close-dialog="modifyClose" />
    </template>
  </el-page-header>
</template>

<script setup lang="ts">
import { TokenStore } from "@/stores/TokenStore";
import { SwitchAside } from "@/stores/switch/SwitchAside"
const switchAside = SwitchAside()

// === 登出 ===
const tokenStore = TokenStore()
const logout = () => {
  tokenStore.$reset()
  router.push("/")
}
// ============


// === 更新跳转 ===
const router = useRouter()
const getBackPath = () => router.currentRoute.value.matched.slice(-2)[0].path
const getPaths = () => router.currentRoute.value.matched.slice(-1)[0].path.split("/").slice(1)
const paths = ref(getPaths())
const backUrlName = ref(getBackPath())
const jump = () => router.push(backUrlName.value)
watch(router.currentRoute, () => {
  backUrlName.value = getBackPath()
  paths.value = getPaths()
})
// ================

// === 修改用户的diglog ===
const modifyDialogVisible = ref<Boolean>(false)
const addOpen = () => {
  switchAside.hasDiglog = modifyDialogVisible.value = true
}
const modifyClose = (value: boolean) => {
  switchAside.hasDiglog = modifyDialogVisible.value = value
}
// ======================
</script>

<style scoped></style>
