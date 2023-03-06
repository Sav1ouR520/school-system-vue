<template>
  <div border-2 p-2 rounded-xl border-gray-200 mt-4>
    <!-- <el-table :data="" style="width: 100%">
    <el-table-column fixed prop="date" label="Date" width="150" />
    <el-table-column prop="name" label="Name" width="120" />
    <el-table-column prop="state" label="State" width="120" />
    <el-table-column prop="city" label="City" width="120" />
    <el-table-column prop="address" label="Address" width="600" />
    <el-table-column prop="zip" label="Zip" width="120" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default>
        <el-button link type="primary" size="small">Detail</el-button>
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table> -->
  </div>
</template>

<script setup lang="ts">
import { findFileBytaskId } from "@/api/file"
import { GroupPage } from "@/stores/pages/GroupPage"

const page = GroupPage()
const files = findFileBytaskId(page.click.id)
</script>

<style scoped></style>
