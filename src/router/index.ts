import { createRouter, createWebHistory } from "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    title: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      meta: {
        title: "登录",
      },
      component: () => import("@/views/IndexViews.vue"),
    },
    {
      path: "/main",
      name: "main",
      meta: {
        title: "欢迎使用",
      },
      component: () => import("@/views/MainViews.vue"),
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
