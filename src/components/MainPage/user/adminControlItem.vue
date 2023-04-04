<template>
  <div flex flex-grow flex-col rounded-xl w-full p-4 bg-white>
    <div flex :class="checkPageWindow() ? 'flex-col' : 'flex-row'" mb-4>
      <div flex flex-row>
        <div flex items-center text-xl font-bold h-8 :class="checkPageWindow() ? 'flex-grow' : 'mr-8'">用 户 管 理</div>
        <div flex items-center mr-4>
          <span cursor-pointer font-bold mr-1 @click="condition.role.active = !condition.role.active" :class="condition.role.active ? 'text-green' : 'text-gray'">权限</span>
          <el-switch :disabled="!condition.role.active" v-model="condition.role.value" active-value="admin" inactive-value="user" inline-prompt font-400 active-text="管理" inactive-text="普通" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #409eff" />
        </div>
        <div flex items-center mr-4>
          <span cursor-pointer font-bold mr-1 @click="condition.status.active = !condition.status.active" :class="condition.status.active ? 'text-green' : 'text-gray'">状态</span>
          <el-switch :disabled="!condition.status.active" v-model="condition.status.value" inline-prompt font-400 active-text="正常" inactive-text="封禁" />
        </div>
        <div flex items-center :class="checkPageWindow() ?'mr-7':''">
          <span font-bold mr-1 @click="condition.registerTime.active = !condition.registerTime.active" :class="condition.registerTime.active ? 'text-green' : 'text-gray'">之后</span>
          <el-date-picker value-format="YYYY-MM-DD" :disabled="!condition.registerTime.active" :editable="false" v-model="condition.registerTime.value" type="date" />
        </div>
      </div>
      <div flex flex-grow :class="checkPageWindow() ? 'mt-4' : 'ml-10'">
        <el-select mr-2 v-model="condition.input.type" placeholder="条件查询">
          <el-option label="名称" value="username" />
          <el-option label="账号" value="account" />
          <el-option label="" value="" />
        </el-select>
        <el-input :disabled="condition.input.type === ''" v-model="condition.input.value"></el-input>
        <el-button ml-2 type="primary" @click="search()">{{ condition.input.type === "" ? "全局" : "" }}搜索</el-button>
      </div>
    </div>
    <div border-4 rounded font-bold>
      <table w-full>
        <thead>
          <tr align="center" h-12>
            <th pl-4 align="left">用 户</th>
            <th>账 号</th>
            <th v-if="!checkPageWindow()">注 册 时 间</th>
            <th>状 态</th>
          </tr>
        </thead>
        <tbody>
          <tr align="center" cursor-pointer hover:bg-gray-100 h-12 v-for="user in users" :key="user.id" @click="modifyOpen(user.id)">
            <td pl-4 align="left">
              <div flex items-center>
                <el-avatar mr-1 @dragstart.prevent :src="user.icon ? '/data/user/' + user.icon : null">
                  <i-ic:baseline-image />
                </el-avatar>
                <div v-if="!checkPageWindow()" flex justify-center items-center h-6 px-2 :class="user.role === 'admin' ? 'bg-yellow' : 'bg-blue'" rounded text-white>{{ user.username }}</div>
              </div>
            </td>
            <td>
              {{ user.account }}
            </td>
            <td v-if="!checkPageWindow()">
              {{ moment(user.registerTime).format("YYYY-MM-DD HH:mm:ss") }}
            </td>
            <td>
              <div :class="user.status ? 'bg-green' : 'bg-gray'" w-10 rounded text-white>
                {{ user.status ? "正常" : "封禁" }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div flex justify-end h-12 mr-4>
        <el-pagination v-model:current-page="offset" @current-change="search()" background layout="total, prev, pager, next" :total="total" />
      </div>
    </div>
  </div>
  <adminModifyUser :userId="userId" :dialog="dialogVisible" @close-dialog="modifyClose"></adminModifyUser>
</template>

<script setup lang="ts">
import { findAll } from "@/api/user"
import type { UserInfo } from "@/interface/user"
import { SwitchAside } from "@/stores/switch/SwitchAside"
import moment from "moment"

const condition = reactive({
  role: {
    active: false,
    value: "",
  },
  status: {
    active: false,
    value: true,
  },
  registerTime: {
    active: false,
    value: new Date(),
  },
  input: {
    type: "",
    value: "",
  },
})
// === 屏幕检测 ===
const window = useWindowSize()
const checkPageWindow = () => {
  return window.width.value <= 768
}

// ===============

// === 用户信息修改 ===
const switchAside = SwitchAside()
const userId = ref("")
const dialogVisible = ref<Boolean>(false)
const modifyOpen = (id: string) => {
  switchAside.hasDiglog = dialogVisible.value = true
  userId.value = id
}
const modifyClose = (value: boolean) => {
  switchAside.hasDiglog = dialogVisible.value = value
  search()
}

const users = ref<UserInfo[]>([])
const total = ref(0)
const offset = ref(1)
const search = () => {
  console.log(offset.value)
  const conditions = {
    role: condition.role.active ? (condition.role.value as "user" | "admin") : undefined,
    registerTime: condition.registerTime.active ? condition.registerTime.value : undefined,
    status: condition.status.active ? condition.status.value : undefined,
    username: condition.input.type === "username" ? condition.input.value : undefined,
    account: condition.input.type === "account" ? condition.input.value : undefined,
    offset: offset.value,
    limit: 10,
  }
  findAll(conditions)
    .then(data => {
      users.value = data.data.list
      total.value = data.data.total
    })
    .catch(() => {
      location.reload()
      ElNotification({ message: `你没有权限`, type: "error" })
    })
}
search()

// ==================
</script>

<style scoped>
:deep(.el-input__icon) {
  margin-right: 0;
}
:deep(.el-date-editor) {
  width: 32px;
}
</style>
