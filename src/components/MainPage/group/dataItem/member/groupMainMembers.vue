<template>
  <groupMainAddMember :dialog="addDialogVisible" @close-dialog="addClose" @add-member="refresh" />
  <mainGroupModifyMember :dialog="modifyDialogVisible" @close-dialog="modifyClose" @modify-member="refresh"
    :memberId="memberId" />
  <mainGroupCheckMember :dialog="checkDialogVisible" @close-dialog="checkClose" :memberId="memberId" />
  <groupMainCard name="群成员" :num="members.length" :refresh="refreshData" :modify="modifyAcitve" :add="addFn"
    :minus="deleteActive" :sumbit="sumbit" @change-delete-status="getDeleteStatus"
    @change-modify-status="getModifyStatus">
    <template v-slot:list>
      <el-scrollbar>
        <div items-center border border-transparent hover:border-current cursor-pointer
          :class="[deleteActive ? 'hover:bg-red-100' : '', modifyAcitve ? 'hover:bg-blue-100' : '', chooseList.includes(`${member.id}`) ? 'text-red' : 'text-black']"
          v-for="member in members" :key="member.id" @click="choose(`${member.id}`)">
          <div flex h-10 flex-grow px-2 justify-between items-center w-full>
            <div flex items-center>
              <el-avatar :size="30" :src="member.icon ? '/data/user/' + member.icon : null" @dragstart.prevent>
                <i-ic:baseline-image text-sm />
              </el-avatar>
              <span ml-2>{{ member.name }}</span>
            </div>
            <i-ic:outline-account-circle text-3xl :class="member.role === 'admin' ? 'text-yellow' : ''" />
          </div>
        </div>
      </el-scrollbar>
    </template>
    <template v-slot:base>
      <div flex items-center justify-between rounded-full cursor-pointer @click="addFn()">
        <i-ic:outline-add />
      </div>
    </template>
  </groupMainCard>
</template>

<script setup lang="ts">
import { deleteMember, findMemberByGroupId } from "@/api/member"
import type { GroupMember } from "@/interface/member"
import { GroupPage } from "@/stores/pages/GroupPage"
import { SwitchAside } from "@/stores/switch/SwitchAside"

const page = GroupPage()
const getMember = () => {
  return findMemberByGroupId(page.group.id).then(data => {
    members.value = data!.data as GroupMember[]
    page.item.members = members.value.length
  })
}
const members = ref<GroupMember[]>([])
getMember()

const refreshData = () => {
  getMember()
    .then(() => ElNotification({ message: `成功刷新成员`, type: "success" }))
    .catch(() => {
      page.update = { time: new Date().valueOf(), type: "all" }
      ElNotification({ message: `刷新成员失败`, type: "error" })
    })
}
// === 打开添加的diglog ===
const switchAside = SwitchAside()
const addDialogVisible = ref<Boolean>(false)
const addFn = async () => {
  switchAside.hasDiglog = addDialogVisible.value = true
}
const addClose = (value: boolean) => {
  switchAside.hasDiglog = addDialogVisible.value = value
}
// ================

// === 更新数据
const refresh = async (value: boolean) => {
  if (value) getMember()
}
// ================

// === 数据更改监听 ===
const timer = ref(0)
page.$subscribe(
  async (mutation, state) => {
    const updateTime = state.update.time
    if (state.update.type === "all") {
      modifyAcitve.value = deleteActive.value = false
    }
    if ((state.update.type === "member" || state.update.type === "all") && updateTime > timer.value) {
      timer.value = updateTime
      getMember()
    }
  },
  { detached: true, deep: true },
)
// ===================

const memberId = ref("")
// === 打开修改的diglog ===
const modifyDialogVisible = ref<Boolean>(false)
const modifyFn = (id: string) => {
  switchAside.hasDiglog = modifyDialogVisible.value = true
  memberId.value = id
}
const modifyClose = (value: boolean) => {
  switchAside.hasDiglog = modifyDialogVisible.value = value
}
// =======================

// === 打开查看用户信息 ===
const checkDialogVisible = ref<Boolean>(false)
const checkFn = (id: string) => {
  switchAside.hasDiglog = checkDialogVisible.value = true
  memberId.value = id
}
const checkClose = (value: boolean) => {
  switchAside.hasDiglog = checkDialogVisible.value = value
}
// =======================

// === 修改成员 ===
const modifyAcitve = ref<boolean>(false)
const getModifyStatus = (value: boolean) => {
  modifyAcitve.value = value
}
// ===============

// === 删除成员 ===
const deleteActive = ref<boolean>(false)
const chooseList = ref<string[]>([])
// ===============

// === 重置状态 ===
const getDeleteStatus = (value: boolean) => {
  deleteActive.value = value
  chooseList.value = []
}
// ===============

// === 获取选中的member ===
const choose = (id: string) => {
  if (deleteActive.value) {
    if (!chooseList.value.includes(id)) {
      chooseList.value.push(id)
    } else {
      chooseList.value = chooseList.value.filter(x => x !== id)
    }
  } else {
    if (modifyAcitve.value) {
      modifyFn(id)
    } else {
      checkFn(id)
    }
  }
}
// ===============

// === 提交删除请求 ===
const sumbit = () => {
  if (chooseList.value.length !== 0) {
    deleteMember(chooseList.value)
      .then(() => {
        getMember()
        ElNotification({ message: `成功删除成员`, type: "success" })
      })
      .catch(() => ElNotification({ message: `删除成员失败`, type: "error" }))
  }
}
// ===================
</script>
