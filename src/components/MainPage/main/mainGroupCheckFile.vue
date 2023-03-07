<template>
  <div border-2 p-2 rounded-xl border-gray-200 mt-4 w-full >

  </div>
</template>

<script setup lang="ts">
import { findFileBytaskId } from "@/api/file"
import { GroupPage } from "@/stores/pages/GroupPage"

const page = GroupPage()
const data = (await findFileBytaskId(page.click.id)).data
</script>

<style scoped></style>
