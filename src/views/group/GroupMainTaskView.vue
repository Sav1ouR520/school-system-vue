<template>
  <div>
    {{ id }}
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
let id = route.query.task
</script>

<style scoped>

</style>