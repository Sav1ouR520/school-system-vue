<template>
  <div flex flex-col flex-grow m-4 rounded-xl>
    <userHeaderItem mb-4 />
    <userMainItem mb-4 />
    <el-scrollbar rounded-xl border-2 v-if="user.role === 'admin'" >
      <adminControlItem />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { getUserInfo } from "@/api/user"
import { UserPage } from "@/stores/pages/UserPage"

const user = UserPage()
getUserInfo()
  .then(data => {
    user.$state = data.data
  })
  .catch(() => {
    ElNotification({ message: `数据获取失败`, type: "error" })
  })
</script>

<style scoped></style>
