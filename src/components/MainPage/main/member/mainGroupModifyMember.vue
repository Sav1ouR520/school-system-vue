<template>
  <el-dialog v-model="dialogVisible" width="25rem" :before-close="send" draggable align-center>
    <template #header="{ titleId }">
      <div flex items-center>
        <el-avatar mr-1 :size="30" v-if="formMember.icon" :src="'/data/user/' + formMember.icon">
          <i-ic:baseline-image text-sm />
        </el-avatar>
        <div :id="titleId">修改成员信息</div>
      </div>
    </template>
    <el-form hide-required-asterisk status-icon :rules="rules" :model="formMember" size="large" ref="ruleFormRef"
      @submit.prevent>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formMember.name" />
      </el-form-item>
      <el-form-item label="权限">
        <el-select v-model="formMember.role" placeholder="权限" w-full :disabled="modifyRole()">
          <el-option label="普通用户" value="user" />
          <el-option label="管理员" value="admin" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="danger" @click="close()">取消</el-button>
      <el-button type="primary" @click="sumbit(ruleFormRef)">修改</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { findMemberByMemberId, modifyMemberWithAdmin } from "@/api/member"
import type { Member } from "@/interface/member"
import { TokenStore } from "@/stores/TokenStore"
import { GroupPage } from "@/stores/pages/GroupPage"
import type { FormInstance, FormItemRule } from "element-plus"

// === 开关diglog 使用Props和Emits作为父子组件通信[可以pinia] ===
const dialogVisible = ref<boolean>(false)
const props = defineProps<{ dialog: boolean; memberId: string }>()
watch(props, async () => {
  dialogVisible.value = props.dialog
  if (props.memberId !== "" && props.dialog) {
    getData()
  }
})
const emit = defineEmits<{
  (e: "close-dialog", value: boolean): void
  (e: "modify-member", value: boolean): void
}>()
const send = () => {
  emit("close-dialog", false)
  backup.role = backup.name = ""
}
const close = () => {
  send()
  emit("modify-member", false)
}
// ===========================================================

// === 数据获取 ===
const page = GroupPage()
const user = TokenStore()
const backup = reactive({ role: "", name: "" })
const getData = () =>
  findMemberByMemberId(page.group.id, props.memberId).then(data => {
    formMember.value = data.data as Member
    backup.role = data.data!.role
    backup.name = data.data!.name
  })
const reset = () => ({ id: "", name: "", groupId: "", role: "" as "user", joinTime: new Date, icon: "", userId: "" })
const formMember = ref<Member>(reset())
const ruleFormRef = ref<FormInstance>()
const rules = reactive<{ name: Array<FormItemRule> }>({
  name: [{ required: true, message: "名字不能为空", trigger: "blur" }],
})
const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      const data = { id: formMember.value.id, groupId: formMember.value.groupId, name: formMember.value.name }
      let result = null
      if (formMember.value.role !== backup.role && formMember.value.name !== backup.name) {
        result = modifyMemberWithAdmin({ ...data, role: formMember.value.role, name: formMember.value.name })
      } else if (formMember.value.role !== backup.role) {
        result = modifyMemberWithAdmin({ ...data, role: formMember.value.role })
      } else if (formMember.value.name !== backup.name) {
        result = modifyMemberWithAdmin({ ...data, name: formMember.value.name })
      }
      if (formMember.value.role !== backup.role || formMember.value.name !== backup.name) {
        result
          ?.then(() => {
            page.update = { type: "member", time: new Date().valueOf() }
            ElNotification({ message: `成功修改用户信息`, type: "success" })
          })
          .catch(() => ElNotification({ message: `修改用户信息失败`, type: "error" }))
      }
      close()
    }
  })
}
const modifyRole = () => {
  if (user.userId === formMember.value.userId) return true
  if (user.userId === page.group.owner) return false
  if (formMember.value.role === "admin") return true
}
// ===============
</script>

<style scoped></style>
