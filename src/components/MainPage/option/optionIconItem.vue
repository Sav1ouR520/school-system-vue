<template>
  <div h-17.5 class="flex-center" @click="change">
    <div h-12.5 w-12.5 rounded-full hover:bg-gray-800 class="flex-center" cursor-pointer>
      <a text-3xl :class="[icon, color()]"></a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SwitchAside } from "@/stores/switch/SwitchAside"
const router = useRouter()
// === 当选中指定图标，切换改图标颜色为绿色 同时修改其他为白色 ===
const switchAside = SwitchAside()
const props = defineProps<{ item: string; icon: string }>()
const change = () => {
  switchAside.item = props.item
  if (switchAside.item === "user") {
    router.push('/main/user')
  }
  // else if (router.currentRoute.value.name === 'user' && switchAside.item !== "user") {
  //   router.push('/main')
  // }
}
const color = () => (switchAside.item === props.item ? "text-green" : "text-white")
// ==========================================================
</script>

<style scoped>
.flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
