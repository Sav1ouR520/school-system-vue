<template>
  <modifyTaskItem v-if="page.click.status === 'modify'" />
  <uploadFileTaskItem v-else-if="page.click.status === 'add'" />
  <mainGroupCheckFile v-else-if="page.click.status === 'check'" />
</template>

<script setup lang="ts">
import { GroupPage } from "@/stores/pages/GroupPage"
const page = GroupPage()
</script>
