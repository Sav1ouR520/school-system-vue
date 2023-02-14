<template>
  <el-page-header @back="router.back()">
    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>Main</el-breadcrumb-item>
        <el-breadcrumb-item>Group</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <template #content>
      <div flex items-center>
        <el-avatar class="mr-3" :size="32" :src="iconUrl">
          <i-ic:baseline-image text-xl />
        </el-avatar>
        <span font-bold>{{ group.data!.name }}</span>
      </div>
    </template>
  </el-page-header>
</template>

<script setup lang="ts">
import { findGroupByGroupId } from '@/api/group';
const props = defineProps<{
  id: string
}>()
const group = await findGroupByGroupId(props.id)

// === 路由跳转 ===
const router = useRouter()
// ===============

// === 拼接icon-url地址 ===
const iconUrl = computed(() => {
  return "/data/group/" + group.data!.icon
})
// ========================

</script>