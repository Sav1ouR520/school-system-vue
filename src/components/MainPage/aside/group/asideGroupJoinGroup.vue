<template>
  <el-dialog v-model="dialogVisible" title="加入组" width="30rem" :before-close="send" draggable align-center>
    <div flex>
      <el-form flex-grow mr-4 hide-required-asterisk :rules="rules" ref="ruleFormRef" :model="code">
        <el-form-item prop="inviteCode">
          <el-input placeholder="这里输入邀请码" v-model="code.inviteCode">
            <template #prefix>
              <i-ep-message></i-ep-message>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="sumbit(ruleFormRef)">加入</el-button>
    </div>
    <template #footer>
      <div flex justify-between text-3 text-gray>
        <div>目前只支持通过邀请码加入</div>
        <div>[使用小伙伴的邀请码加入吧]</div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { joinGroupByInviteCode } from "@/api/group"
import type { FormInstance, FormItemRule } from "element-plus"

// === 开关diglog 使用Props和Emits作为父子组件通信[可以pinia] ===
const dialogVisible = ref<boolean>(false)
const props = defineProps<{ dialog: boolean }>()
watch(props, async () => {
  dialogVisible.value = props.dialog
})
const emit = defineEmits<{
  (e: "close-dialog", value: boolean): void
  (e: "join-group", value: number): void
}>()
const send = () => {
  emit("close-dialog", false)
}
const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      joinGroupByInviteCode(code.inviteCode)
        .then(data => {
          if (data.action) {
            ElNotification({ message: `成功加入组`, type: "success" })
            emit("join-group", new Date().valueOf())
          } else {
            ElNotification({ message: `用户已经在组里`, type: "error" })
          }
        })
        .catch(() => ElNotification({ message: `邀请码无效/组不存在`, type: "error" }))
        .finally(() => send())
    }
  })
}
// ===========================================================

// === 表单验证 ===
const code = reactive({ inviteCode: "" })
const ruleFormRef = ref<FormInstance>()
const rules = reactive<{ inviteCode: Array<FormItemRule> }>({
  inviteCode: [
    { required: true, message: "邀请码不能为空", trigger: "blur" },
    { required: true, message: "邀请码不能为空", trigger: "change" },
  ],
})
</script>

<style scoped></style>
