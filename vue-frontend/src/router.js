import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import Admin from "./views/Admin.vue";
import { useAuthStore } from "./store/auth";

const routes = [
    { path: "/", component: Home, meta: { requiresAuth: true }},
    { path: "/login", component: Login },
    { path: "/admin", component: Admin, meta: { requiresAuth: true }}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.user) {
      next('/login');
    } else {
      next();
    }
});
export default router;
