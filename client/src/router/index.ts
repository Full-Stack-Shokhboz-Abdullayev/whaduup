import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "../store/user.store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/auth",
    name: "auth",
    beforeEnter: () => {
      const userStore = useUserStore();
      if (userStore.me) {
        return router.push({
          name: "chat",
        });
      }
    },
    component: () =>
      import(/* webpackChunkName: "auth" */ "@/views/auth/Index.vue"),
    children: [
      {
        path: "login",
        name: "auth-login",
        component: () =>
          import(/* webpackChunkName: "auth-login" */ "@/views/auth/Login.vue"),
      },
      {
        path: "register",
        name: "auth-register",
        component: () =>
          import(
            /* webpackChunkName: "auth-register" */ "@/views/auth/Register.vue"
          ),
      },
    ],
  },
  {
    path: "/chat",
    name: "chat",
    redirect: "chat.fallback",
    // beforeEnter: requiresAuth(true),
    component: () =>
      import(/* webpackChunkName: "chat" */ "../views/chat/Index.vue"),
    children: [
      {
        path: ":username",
        name: "chat-room",
        component: () =>
          import(
            /* webpackChunkName: "chat-room" */ "../views/chat/Messages.vue"
          ),
      },
      {
        path: "",
        name: "fallback",
        component: () =>
          import(
            /* webpackChunkName: "fallback" */ "../views/chat/Fallback.vue"
          ),
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/chat",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
