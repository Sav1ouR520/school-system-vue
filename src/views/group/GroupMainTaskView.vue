<template>
  <Suspense>
    <template #default>
      <mainGroupModifyTask v-if="page.click.status === 'modify'" />
      <mainGroupAddFile v-else-if="page.click.status === 'add'" />
      <mainGroupCheckFile v-else-if="page.click.status === 'check'"/>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { GroupPage } from "@/stores/pages/GroupPage"
const page = GroupPage()
</script>
