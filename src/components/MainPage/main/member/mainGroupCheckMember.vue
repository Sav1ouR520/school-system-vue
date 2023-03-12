<template>
  <el-dialog v-model="dialogVisible" width="25rem" :before-close="send" draggable align-center>
    <template #header="{ titleId }">
      <div flex items-center>
        <el-avatar mr-1 :size="30" :src="member.icon">
          <i-ic:baseline-image text-sm />
        </el-avatar>
        <div :id="titleId">成员信息</div>
      </div>
    </template>
    <div flex items-center mb-4 h-10 border-black bg-gray-200 rounded border-2 text-black>
      <span flex justify-center w-20 font-bold border-r-2 border-gray>姓名</span>
      <span ml-2 flex justify-center flex-grow>{{ member.name }}</span>
    </div>
    <div flex items-center mb-4 h-10 border-black bg-gray-200 rounded border-2 text-black>
      <span flex justify-center w-20 font-bold border-r-2 border-gray>权限</span>
      <span ml-2 flex justify-center flex-grow>{{ member.role }}</span>
    </div>
    <div flex items-center h-10 border-black bg-gray-200 rounded border-2 text-black>
      <span flex justify-center w-20 font-bold border-r-2 border-gray>入群时间</span>
      <span ml-2 flex justify-center flex-grow>{{ moment(member.joinTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
    </div>
    <template #footer>
      <el-button w-full type="primary" @click="close()">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { findMemberByMemberId } from "@/api/member"
import type { Member } from "@/interface/member"
import { GroupPage } from "@/stores/pages/GroupPage"
import moment from "moment"

// === 开关diglog 使用Props和Emits作为父子组件通信[可以pinia] ===
const dialogVisible = ref<boolean>(false)
const props = defineProps<{ dialog: boolean; memberId: string }>()
watch(props, async () => {
  dialogVisible.value = props.dialog
  if (props.memberId !== "" && props.dialog) getData()
})
const emit = defineEmits<{
  (e: "close-dialog", value: boolean): void
}>()
const send = () => {
  emit("close-dialog", false)
  member.value = reset()
}
const close = () => {
  send()
}
// ===========================================================

// === 数据获取 ===
const page = GroupPage()
const getData = () => findMemberByMemberId(page.group.id, props.memberId).then(data => (member.value = data.data as Member))
const reset = () => ({ id: "", name: "", groupId: "", role: "" as "user", joinTime: "", icon: "", userId: "" })
const member = ref<Member>(reset())
// ===============
</script>

<style scoped></style>
