<template>
  <div flex overflow-hidden flex-grow>
    <div flex-grow m-4 mt-0 rounded-xl bg-white>
      <el-scrollbar p-4>
        <uploadFileTaskItem v-if="page.type === 'upload'" />
        <modifyTaskItem v-else-if="page.type === 'modify'" />
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup lang="ts">
import { TaskPage } from "@/stores/pages/TaskPage"
const page = TaskPage()
</script>
