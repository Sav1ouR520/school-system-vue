<template>
  <groupMainCard name="群成员" :num="members.data!.length" :add="addFn" :minus="minusFn" :sumbit="sumbit">
    <template v-slot:list>
      <el-scrollbar>
        <div flex flex-col items-center v-for="member in members.data" :key="member.userId">
          <div flex h-10 w-full items-center justify-center>
            <div flex flex-grow items-center>
              <el-avatar class="mr-1" :size="32" :src="userIcon(member.icon)">
                <i-ic:baseline-image text-xl />
              </el-avatar>
              <span>{{ member.name }} </span>
            </div>
            <div flex justify-center>
              <i-ic:outline-account-circle text-2xl :class="member.role === 'admin' ? 'text-yellow' : ''" />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </template>
  </groupMainCard>
</template>

<script setup lang="ts">
import { findMember } from '@/api/member';

// === 获取id 查询组的信息 ===
const prop = defineProps<{ id: string }>()
const members = await findMember(prop.id)
const userIcon = (icon: string) => {
  return '/data/user/' + icon
}
const emit = defineEmits(['getMemberNumber'])
emit('getMemberNumber', members.data!.length)
// ==========================

const addFn = () => { }

const minusFn = () => { }
const sumbit = () => { }
</script>