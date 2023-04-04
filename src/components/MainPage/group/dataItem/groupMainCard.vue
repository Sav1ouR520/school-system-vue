<template>
  <div m-2 mt-0 flex items-center>
    <span mr-4 font-bold text-blue cursor-pointer @click="refresh()">{{ name }}</span>
    <span text-sm flex-grow>{{ num }}</span>
    <div flex items-center justify-between  v-if="page.userRole === 'admin'">
      <slot name="icon"></slot>
      <div flex items-center justify-between rounded-full cursor-pointer @click="modifyChange()" :class="modify ? 'text-blue' : ''">
        <i-ic:twotone-create />
      </div>
      <div flex items-center justify-between rounded-full cursor-pointer v-show="!minus" @click="add()">
        <i-ic:outline-add />
      </div>
      <div flex items-center justify-between rounded-full cursor-pointer v-show="!minus" @click="deleteActive()">
        <i-ic:outline-minus />
      </div>
      <div flex items-center justify-between rounded-full cursor-pointer v-show="minus" @click="deleteCancel()">
        <i-ic:outline-cancel />
      </div>
      <div flex items-center justify-between rounded-full cursor-pointer v-show="minus" @click="deleteCancel()">
        <i-ic:baseline-check-circle-outline @click="sumbit()" />
      </div>
    </div>
    <div flex items-center justify-between  v-else>
      <slot name="base"> </slot>
    </div>
  </div>
  <slot name="list"></slot>
</template>
<script setup lang="ts">
import { GroupPage } from "@/stores/pages/GroupPage"

const page = GroupPage()
const props = defineProps<{
  name: string
  num: number
  modify: Boolean
  add: Function
  minus: Boolean
  sumbit: Function
  refresh:Function
}>()
const emit = defineEmits<{
  (e: "change-modify-status", value: boolean): void
  (e: "change-delete-status", value: boolean): void
}>()
const deleteActive = () => {
  emit("change-modify-status", false)
  emit("change-delete-status", true)
}
const deleteCancel = () => {
  emit("change-modify-status", false)
  emit("change-delete-status", false)
}
const modifyChange = () => {
  emit("change-delete-status", false)
  emit("change-modify-status", !props.modify)
}
</script>
