<template>
  <div h-full w-full bg-gradient-to-r from-green-500 to-blue-400>
    <div w-full h-full min-h-135>
      <transition appear appear-active-class="animate__animated animate__backInLeft">
        <div w-full h-full bg-cover class="images"></div>
      </transition>
      <transition appear appear-active-class="animate__animated animate__backInRight">
        <div absolute flex flex-col justify-center items-center h-full lg:w-135 w-screen opacity-75 bg-white top-0
          right-0 min-h-135>
          <h1 font-bold text-center text-30 m-0>{{ title }}</h1>
          <div mx-auto class="w-4/5">
            <slot name="form"></slot>
            <slot name="info"></slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style scoped>
.images {
  background-image: url("@/assets/image.jpg");
}
</style>
