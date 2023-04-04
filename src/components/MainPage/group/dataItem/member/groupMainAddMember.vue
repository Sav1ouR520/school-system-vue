<template>
  <el-dialog v-model="dialogVisible" title="添加成员" width="30rem" :before-close="send" draggable align-center>
    <div flex h-8>
      <div flex flex-grow justify-center items-center border-black bg-gray-200 rounded border-2 cursor-pointer text-black @click="successCopy()">
        <span flex justify-center flex-grow>{{ source }}</span>
        <span text-1 text-gray pr-2>[点击复制]</span>
      </div>
      <div v-if="page.userRole === 'admin'" flex items-center border-black bg-gray-200 rounded ml-2 w-8 border-2 justify-center cursor-pointer @click="refreshCode()"><i-ic:baseline-refresh text-xl text-black /></div>
    </div>
    <div flex justify-between text-1 text-gray>
      <div>目前只支持通过邀请码加入</div>
      <div>[快发送给小伙伴加入吧]</div>
    </div>
    <template #footer>
      <el-button w-full type="primary" @click="close()">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getGroupInviteCode, updateInviteCode } from "@/api/group"
import { GroupPage } from "@/stores/pages/GroupPage"

// === 开关diglog 使用Props和Emits作为父子组件通信[可以pinia] ===
const dialogVisible = ref<boolean>(false)
const props = defineProps<{ dialog: boolean }>()
const getData = () => getGroupInviteCode(page.group.id).then(data => (source.value = data.data!.inviteCode))

watch(props, async () => {
  dialogVisible.value = props.dialog
  if (props.dialog) getData()
})
const emit = defineEmits<{
  (e: "close-dialog", value: boolean): void
  (e: "add-member", value: boolean): void
}>()
const send = () => {
  emit("close-dialog", false)
}
const close = () => {
  send()
  emit("add-member", false)
}

// ===========================================================
const page = GroupPage()
const source = ref("")
const { copy } = useClipboard({ source })
const successCopy = () => {
  copy()
  ElMessage({
    message: "复制邀请码成功",
    type: "success",
  })
}
const refreshCode = async () => {
  updateInviteCode(page.group.id).then(data => (source.value = data.data!.inviteCode))
  ElMessage({
    message: "刷新邀请码成功",
    type: "success",
  })
}
</script>

<style scoped></style>
