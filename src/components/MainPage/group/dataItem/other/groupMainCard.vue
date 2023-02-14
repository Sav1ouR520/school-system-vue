<template>
  <div pt-2 rounded-t-xl>
    <div flex items-center>
      <span mr-4 font-bold>{{ name }}</span>
      <span text-sm flex-grow>{{ num }}</span>
      <div relative flex items-center justify-between h-full w-12.5>
        <div flex items-center justify-between rounded-full cursor-pointer font-bold v-show="!minus" @click="add()">
          <i-ic:outline-add />
        </div>
        <div flex items-center justify-between rounded-full cursor-pointer font-bold v-show="!minus" @click="active()">
          <i-ic:outline-minus />
        </div>
        <div flex items-center justify-between rounded-full cursor-pointer font-bold v-show="minus" @click="cancel()">
          <i-ic:outline-cancel />
        </div>
        <div flex items-center justify-between rounded-full cursor-pointer font-bold v-show="minus" @click="cancel()">
          <i-ic:baseline-check-circle-outline @click="sumbit()" />
        </div>
      </div>
    </div>
  </div>
  <slot name="list"></slot>
</template>
<script setup lang="ts" >
defineProps<{
  name: string
  num: number
  add: Function
  minus: Boolean
  sumbit: Function
}>()
const emit = defineEmits<{ (e: "change-status", value: boolean): void }>()
const active = () => {
  emit("change-status", true)
}
const cancel = () => {
  emit("change-status", false)
}

</script>
