<template>
  <div h-screen bg-gradient-to-r from-green-500 to-blue-400>
    <div w-full h-full relative>
      <transition appear appear-active-class="animate__animated animate__backInLeft">
        <div w-full h-full bg-cover class="images"></div>
      </transition>
      <transition appear appear-active-class="animate__animated animate__backInRight">
        <div absolute flex flex-col justify-center items-center top-0 right-0 w-135 h-full opacity-75 bg-white>
          <h1 font-bold text-center text-5xl m-0>{{ title }}</h1>
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
