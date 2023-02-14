<template>
  <el-scrollbar ml-1 flex flex-col flex-grow>
    <div flex items-center m-4 ml-3 mb-0 p-4 rounded-xl bg-white h-25>
      <Suspense>
        <template #default>
          <groupHeaderItem :id="id" />
        </template>
      </Suspense>
    </div>
    <groupMainItem :id="id">
      <template v-slot:main>
        <RouterView />
      </template>
    </groupMainItem>
    <groupBottomItem />
  </el-scrollbar>
</template>

<script setup lang="ts">
const route = useRoute()
let id = route.params.id as string
</script>
