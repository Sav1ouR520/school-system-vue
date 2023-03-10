<template>
  <div flex :class="[checkOtherPageWindow() ? 'flex-col' : 'flex-row']" overflow-hidden flex-grow>
    <div flex-grow m-4 :class="[checkOtherPageWindow() ? 'hidden' : ' mr-0', checkGroupPageWindow() ? 'mr-4' : '']" mt-0 rounded-xl bg-white>
      <el-scrollbar p-4>
        <RouterView />
      </el-scrollbar>
    </div>
    <div flex-col min-w-60 :class="[checkOtherPageWindow() ? 'flex-grow' : 'w-1/3', checkGroupPageWindow() ? 'hidden' : 'flex']">
      <div flex-grow m-4 mt-0 p-4 pb-12 rounded-xl overflow-hidden bg-white class="h-1/2">
        <Suspense>
          <template #default>
            <groupMainTask />
          </template>
        </Suspense>
      </div>
      <div flex-grow m-4 mt-0 p-4 pb-12 rounded-xl overflow-hidden bg-white class="h-1/2">
        <Suspense>
          <template #default>
            <groupMainMembers />
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GroupPage } from "@/stores/pages/GroupPage"

// === 查询组的信息 ===
const page = GroupPage()
page.getGroup()
// ==========================

// === 屏幕检测 ===
const router = useRouter()
const routerName = ref(router.currentRoute.value.name)
const window = useWindowSize()
watch(router.currentRoute, () => {
  routerName.value = router.currentRoute.value.name
})
const checkOtherPageWindow = () => {
  return routerName.value === "group" && window.width.value <= 1024
}
const checkGroupPageWindow = () => {
  return routerName.value !== "group" && window.width.value <= 1024
}
// ============
</script>
