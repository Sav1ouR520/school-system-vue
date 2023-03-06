<template>
  <groupMainCard name="群成员" :num="members.length" :modify="modifyFn" :add="addFn" :minus="minusFn" :sumbit="sumbit">
    <template v-slot:list>
      <el-scrollbar>
        <div flex flex-col h-10 w-full items-center justify-center v-for="member in members" :key="member.userId" >
          <div flex flex-grow px-2 justify-between items-center w-full >
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
import { findMember } from "@/api/member";
import { GroupPage } from "@/stores/pages/GroupPage"

const page = GroupPage()
const data=(await findMember(page.group.id))!.data
const members = ref(data ? data : [])
page.item.members= members.value.length

const modifyFn=()=>{}
const addFn = () => {}
const minusFn = () => {}
const sumbit = () => {}
</script>
