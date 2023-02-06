<template>
  <asideMainItem>
    <template v-slot:title>
      <h1>好友</h1>
    </template>
  </asideMainItem>
  <asideMainItem>
    <template #title>
      <h1>群组</h1>
    </template>
    <template #content="{ isActive, timer }">
      <Suspense>
        <template #default>
          <keep-alive>
            <groupInfoItem v-if="isActive" :key="timer" />
          </keep-alive>
        </template>
      </Suspense>
    </template>
  </asideMainItem>
</template>
