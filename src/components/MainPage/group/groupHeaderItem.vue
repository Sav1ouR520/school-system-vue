<template>
  <div m-4 p-4 rounded-xl bg-white h-25>
    <el-page-header @back="jump()">
      <template #breadcrumb>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>Main</el-breadcrumb-item>
          <el-breadcrumb-item>Group</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <template #content>
        <div flex items-center>
          <el-avatar class="mr-3" :size="32" :src="page.group.icon ? '/data/group/' + page.group.icon : null">
            <i-ic:baseline-image text-xl />
          </el-avatar>
          <span font-bold>{{ page.group.name }}</span>
        </div>
      </template>
      <template #extra>
        <div flex items-center>
          <el-button type="primary" @click="open()">设置</el-button>
        </div>
        <Suspense>
          <template #default>
            <groupHeaderModifyGroup :dialog="dialogVisible" @close-dialog="close" @add-group="add" />
          </template>
        </Suspense>
      </template>
    </el-page-header>
  </div>
</template>

<script setup lang="ts">
import { SwitchAside } from "@/stores/switch/SwitchAside"
import { GroupPage } from "@/stores/pages/GroupPage"
const page = GroupPage()
const router = useRouter()

// === 打开diglog ===
const switchAside = SwitchAside()
const dialogVisible = ref<Boolean>(false)
const addTimer = ref<number>(0)
const open = () => {
  switchAside.hasDiglog = dialogVisible.value = true
}
const close = (value: boolean) => {
  switchAside.hasDiglog = dialogVisible.value = value
}
const add = (value: number) => {
  addTimer.value = value
}
// ================

// === 更新跳转 ===
const getBackPath = () => router.currentRoute.value.matched.slice(-2)[0].path as string
const backUrlName = ref(getBackPath())
const jump = () => router.push(backUrlName.value)
watch(router.currentRoute, () => {
  backUrlName.value = getBackPath()
})
// ================
</script>
