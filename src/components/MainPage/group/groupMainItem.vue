<template>
  <div flex flex-row overflow-hidden flex-grow>
    <div flex-grow m-4 mr-0 mt-0 rounded-xl bg-white>
      <el-scrollbar p-4>
        <RouterView />
      </el-scrollbar>
    </div>
    <div flex flex-col class="w-1/3">
      <div flex-grow m-4 mt-0 p-4 pb-12 rounded-xl overflow-hidden bg-white class="h-1/2">
        <Suspense>
          <template #default><groupMainTask /></template>
        </Suspense>
      </div>
      <div flex-grow m-4 mt-0 p-4 pb-12 rounded-xl overflow-hidden bg-white class="h-1/2">
        <Suspense
          ><template #default><groupMainMembers /></template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GroupPage } from "@/stores/pages/GroupPage"

// === 查询组的信息 ===
const page = GroupPage()
page.getGroup()
// ==========================
</script>
