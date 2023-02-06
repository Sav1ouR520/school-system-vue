<template>
  <div v-for="member in members" :key="member.groupId">
    <asideInfoItem :group="member.group">
    </asideInfoItem>
  </div>
</template>

<script setup lang="ts">
import { findGroup } from '@/api/group';
const members = (await findGroup()).data
</script>