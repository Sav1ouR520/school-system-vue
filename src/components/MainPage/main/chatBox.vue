<template>
  <div flex h-17.5 p-2.5>
    <div w-12.5 h-12.5 flex justify-center items-center bg-gray rounded-full>
      <i-carbon:user-avatar-filled text-white text-2xl />
    </div>
    <div h-12.5 flex flex-col justify-center px-1>
      <div class="h-1/3" flex px-1>
        <h1 text-2 align-top>{{ message.name }}</h1>
      </div>
      <div flex-grow rounded bg-blue px-1>
        <h2 inline-block text-4 h-full class="select">{{ message.content }}</h2>
        <span inline-block text-2 align-bottom pl-4>{{ message.time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: {
    name: string,
    content: string,
    time: string,
  }
}>()
</script>

<style scoped>
.select {
  user-select: text;
}
</style>