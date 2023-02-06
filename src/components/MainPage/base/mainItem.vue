<template>
  <div flex flex-col-reverse h-full class="scrollBar">
    <chatBox :message="message" />
  </div>
  <div h-17.5 border-t-2 border-gray pl-2>
    <el-input type="textarea" v-model="test" :resize="'none'" />
  </div>
</template>

<script setup lang="ts">
const test = ref("")
const message = reactive({
  name: 'name',
  content: 'content',
  time: 'time',
})
</script>

<style scoped>
:deep(.el-textarea__inner) {
  padding: 0;
  border-radius: 0;
  box-shadow: 0 0 0 0;
  height: 4.25rem;
}

:deep(.el-textarea__inner::-webkit-scrollbar) {
  width: 0.5rem;
}

:deep(.el-textarea__inner::-webkit-scrollbar-thumb) {
  background-color: gray;
  border-radius: 10px;
}

.el-input {
  --el-input-focus-border-color: 0;
}

.scrollBar {
  overflow-y: scroll;
}

.scrollBar::-webkit-scrollbar {
  width: 0.5rem;
}

.scrollBar::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 10px;
}
</style>