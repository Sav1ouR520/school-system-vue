<template>
  <groupMainAddMember :dialog="dialogVisible" @close-dialog="close" @add-member="add"  />
  <groupMainCard name="群成员" :num="members.length" :modify="modifyAcitve" :add="addFn" :minus="deleteActive" :sumbit="sumbit"  @change-delete-status="getDeleteStatus" @change-modify-status="getModifyStatus">
    <template v-slot:list>
      <el-scrollbar>
        <div items-center border border-transparent hover:border-current cursor-pointer :class="[deleteActive ? 'hover:bg-red-100' : '', modifyAcitve ? 'hover:bg-blue-100' : '', chooseList.includes(`${member.id}`) ? 'text-red' : 'text-black']" v-for="member in members" :key="member.id" @click="choose(`${member.id}`)">
          <div flex h-10 flex-grow px-2 justify-between items-center w-full>
            <div flex items-center>
              <el-avatar :size="30" :src="member.icon">
                <i-ic:baseline-image text-sm />
              </el-avatar>
              <span ml-2>{{ member.name }}</span>
            </div>
            <i-ic:outline-account-circle text-2xl :class="member.role === 'admin' ? 'text-yellow' : ''" />
          </div>
        </div>
      </el-scrollbar>
    </template>
  </groupMainCard>
</template>

<script setup lang="ts">
import { findMember } from "@/api/member"
import { GroupPage } from "@/stores/pages/GroupPage"
import { SwitchAside } from "@/stores/switch/SwitchAside"
import { useRouter } from "vue-router"

const router = useRouter()
const page = GroupPage()
const getMember = async () => (await findMember(page.group.id))!.data
const data = await getMember()
const members = ref(data ? data : [])
page.item.members = members.value.length

// === 打开diglog ===
const switchAside = SwitchAside()
const dialogVisible = ref<Boolean>(false)
const addFn = async () => {
  switchAside.hasDiglog = dialogVisible.value = true
}
const close = (value: boolean) => {
  switchAside.hasDiglog = dialogVisible.value = value
}
const add = async () => {
  const data = await getMember()
  members.value = data ? data : []
}
// ================

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
    router.push(`/main/group/member`)
    page.click.id = id
    page.click.type = "member"
    if (modifyAcitve.value) {
      page.click.status = "modify"
    } else {
      page.click.status = "add"
    }
  }
}
// ===============

// === 提交删除请求 ===
const sumbit = async () => {
  if (chooseList.value.length !== 0) {
    const list = chooseList.value
    if (list.includes(page.click.id)) {
      router.push(`/main/group`)
      page.click.id = ""
      page.click.type = null
    }
    const data = await getMember()
    members.value = data ? data : []
    ElNotification({
      title: "成功",
      message: `成功删除任务`,
      duration: 2000,
      type: "success",
      position: "top-right",
    })
  }
}
// ===================
</script>
