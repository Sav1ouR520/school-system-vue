<template>
  <div flex flex-col flex-grow v-if="page.id !== ''">
    <taskHeaderItem  />
    <taskMainItem  />
  </div>
</template>

<script setup lang="ts">
import { TaskPage } from "@/stores/pages/TaskPage"
const page = TaskPage()
</script>

<style scoped></style>
