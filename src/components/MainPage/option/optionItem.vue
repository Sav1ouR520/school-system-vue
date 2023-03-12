<template>
  <div  flex-col min-w-17.5 bg-gray-900 :class="[checkOtherPageWindow() ? 'hidden' : 'flex']" :style="optionWidth" v-show="switchAside.isActive">
    <div flex-grow>
      <optionIconItem item="group" icon="i-ic:baseline-groups" />
      <optionIconItem item="task" icon="i-carbon:task" />
    </div>
    <div>
      <optionIconItem item="user" icon="i-carbon:user-avatar-filled" />
      <!-- <optionIconItem item="setting" icon="i-ic:baseline-settings" /> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { SwitchAside } from '@/stores/switch/SwitchAside';

// === options的宽度控制 ===
const switchAside = SwitchAside()
const optionWidth = reactive({
  width: switchAside.optionWidth + "px"
})
// ========================

// === 屏幕检测 ===
const router = useRouter()
const routerName = ref(router.currentRoute.value.name)
const window = useWindowSize()
watch(router.currentRoute, () => {
  routerName.value = router.currentRoute.value.name
})
const checkOtherPageWindow = () => {
  return routerName.value !== "main" && window.width.value <= 768
}
// ============
</script>