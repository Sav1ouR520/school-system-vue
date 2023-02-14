import { TokenStore } from "@/stores/TokenStore"
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
      beforeEnter: (to, from, next) => {
        const tokenStore = TokenStore()
        if (tokenStore.verification) next({ name: "main" })
        else next()
      },
    },
    {
      path: "/main",
      name: "main",
      meta: {
        title: "欢迎使用",
      },
      component: () => import("@/views/MainViews.vue"),
      beforeEnter: (to, from, next) => {
        const tokenStore = TokenStore()
        if (tokenStore.verification) next()
        else next({ name: "login" })
      },
      children: [
        {
          path: "/main/group/:id",
          name: "group",
          component: () => import("@/views/GroupViews.vue"),
          meta: {
            title: "group",
          },
          beforeEnter: (to, from, next) => {
            const tokenStore = TokenStore()
            if (tokenStore.verification) next()
            else next({ name: "login" })
          },
          children: [
            {
              path: "/main/group/:id",
              name: "groupTask",
              component: () => import("@/views/group/GroupMainTaskView.vue"),
              meta: {
                title: "group",
              },
              beforeEnter: (to, from, next) => {
                const tokenStore = TokenStore()
                if (tokenStore.verification) next()
                else next({ name: "login" })
              },
            },
          ],
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
