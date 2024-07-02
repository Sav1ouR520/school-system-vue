<template>
  <div flex flex-col rounded-xl w-full p-4 border-2 bg-white>
    <div flex items-center justify-between h-8 font-bold pr-1>
      <div flex items-center>
        <span text-xl mr-1>账 号 信 息</span>
        <span border-2 text-3 rounded :class="user.status ? 'bg-green' : 'bg-gray-5'" text-white px-1>{{ user.status ?
          "正 常" : "封 禁" }}</span>
      </div>
      <span border-2 rounded cursor-pointer text-3 bg-black text-white px-1 @click="logout">登出</span>
    </div>
    <div flex w-full>
      <div w-20 h-35 flex items-center flex-col justify-center mr-2>
        <el-avatar cursor-pointer @dragstart.prevent :size="80" h-25 :src="user.icon ? '/data/user/' + user.icon : null"
          @click="modifyIconOpen()">
          <i-ic:baseline-image text-3xl />
        </el-avatar>
        <div mt-2 text-3 font-bold border-2 rounded px-1 :class="user.role === 'admin' ? 'bg-yellow' : 'bg-blue'"
          text-white>{{ user.role.toLocaleUpperCase() }}</div>
      </div>
      <div flex h-35 flex-col font-bold justify-between flex-grow p-2>
        <div flex items-center>
          <span mr-1 flex justify-end>标识: </span>
          <span border-2 rounded text-3 bg-gray-5 text-white px-1>{{ window.width.value < 500 ? user.id.slice(0, 18) :
            user.id }}</span>
        </div>
        <div flex items-center>
          <span mr-1 flex justify-end>账号: </span>
          <span border-2 rounded text-3 bg-gray-5 text-white px-1>{{ user.account }}</span>
        </div>
        <div flex items-center cursor-pointer @click="modifyUsernameOpen()">
          <span mr-1 flex justify-end>名称: </span>
          <span border-2 rounded text-3 bg-gray-5 text-white px-1>{{ user.username }}</span>
        </div>
        <div flex items-center>
          <span mr-1 flex justify-end>时间:</span> <span border-2 rounded text-3 bg-gray-5 text-white px-1> {{
            user.registerTime !== null ? moment(user.registerTime).format("YYYY-MM-DD HH:mm:ss") : "" }}</span>
        </div>
      </div>
    </div>
    <userModifyIconItem :dialog="iconDialogVisible" @close-dialog="modifyIconClose" />
    <userModifyUsername :dialog="usernameDialogVisible" @close-dialog="modifyUsernameClose" />
  </div>
</template>

<script setup lang="ts">
import { SwitchAside } from "@/stores/switch/SwitchAside"
import { UserPage } from "@/stores/pages/UserPage"
import moment from "moment"
import { TokenStore } from "@/stores/TokenStore"

const switchAside = SwitchAside()
const user = UserPage()

// === 登出 ===
const tokenStore = TokenStore()
const router = useRouter()
const logout = () => {
  tokenStore.$reset()
  router.push("/")
}
// ============

// === 修改用户icon的diglog ===
const iconDialogVisible = ref<Boolean>(false)
const modifyIconOpen = () => {
  switchAside.hasDiglog = iconDialogVisible.value = true
}
const modifyIconClose = (value: boolean) => {
  switchAside.hasDiglog = iconDialogVisible.value = value
}
// ======================

// === 修改用户username的diglog ===
const usernameDialogVisible = ref<Boolean>(false)
const modifyUsernameOpen = () => {
  switchAside.hasDiglog = usernameDialogVisible.value = true
}
const modifyUsernameClose = (value: boolean) => {
  switchAside.hasDiglog = usernameDialogVisible.value = value
}
// ======================

const window = useWindowSize()
</script>

<style scoped></style>
