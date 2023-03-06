<template>
  <div flex flex-col flex-grow v-if="page.group.id!==''">
    <groupHeaderItem :key="page.group.id" />
    <groupMainItem :key="page.group.id"/>
  </div>
</template>

<script setup lang="ts">
import { GroupPage } from "@/stores/pages/GroupPage"
const page = GroupPage()
</script>
