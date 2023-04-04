import { GroupPage } from "@/stores/pages/GroupPage"
import { TaskPage } from "@/stores/pages/TaskPage"
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
        title: "main",
      },
      component: () => import("@/views/MainViews.vue"),
      beforeEnter: (to, from, next) => {
        const tokenStore = TokenStore()
        if (tokenStore.verification) next()
        else next({ name: "login" })
      },
      children: [
        {
          path: "/main/group",
          name: "group",
          component: () => import("@/views/GroupViews.vue"),
          meta: {
            title: "group",
          },
          beforeEnter: (to, from, next) => {
            const tokenStore = TokenStore()
            const page = GroupPage()
            if (!tokenStore.verification) next({ name: "login" })
            if (page.group.id === "") next({ name: "main" })
            else next()
          },
          children: [
            {
              path: "/main/group/task",
              name: "groupTask",
              component: () => import("@/views/GroupMainTaskView.vue"),
              meta: {
                title: "group",
              },
              beforeEnter: (to, from, next) => {
                const tokenStore = TokenStore()
                const page = GroupPage()
                if (!tokenStore.verification) next({ name: "login" })
                if (page.group.id === "") next({ name: "main" })
                if (page.hasClick) next({ name: "group" })
                else next()
              },
            },
          ],
        },
        {
          path: "/main/user",
          name: "user",
          component: () => import("@/views/UserViews.vue"),
          meta: {
            title: "user",
          },
          beforeEnter: (to, from, next) => {
            const tokenStore = TokenStore()
            if (!tokenStore.verification) next({ name: "login" })
            else next()
          },
        },
        {
          path: "/main/task",
          name: "task",
          component: () => import("@/views/TaskViews.vue"),
          meta: {
            title: "task",
          },
          beforeEnter: (to, from, next) => {
            const tokenStore = TokenStore()
            const page = TaskPage()
            if (!tokenStore.verification) next({ name: "login" })
            if (page.id === "") next({ name: "main" })
            else next()
          },
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
