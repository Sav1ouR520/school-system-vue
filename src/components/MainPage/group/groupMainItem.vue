<template>
  <div flex m-4 ml-3 rounded-xl flex-grow>
    <div p-4 mr-4 flex-grow rounded-xl bg-white>
      <slot name="main"></slot>
    </div>
    <div flex flex-col class="w-1/3" max-w-100 min-w-50>
      <div px-4 pt-2 pb-4 rounded-xl bg-white h-46 mb-4>
        <Suspense>
          <template #default>
            <groupMainTask :id="id" :MemberNumber="MemberNumber" />
          </template>
        </Suspense>
      </div>
      <div px-4 pt-2 pb-4 rounded-xl bg-white h-46>
        <Suspense>
          <template #default>
            <groupMainMembers :id="id" @getMemberNumber="getMemberNumber" />
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// === 获取id 查询组的信息 ===
defineProps<{ id: string }>()
const MemberNumber = ref(0)
const getMemberNumber = (num: number) => {
  MemberNumber.value = num
}
// ==========================
</script>
