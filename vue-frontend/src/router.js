import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import Admin from "./views/Admin.vue";
import ComputersOverview from "./views/ComputersOverview.vue";
import ReservationOverview from "./views/ReservationOverview.vue";
import ResourceRequest from "./views/ResourceRequest.vue";
import RequestOverview from "./views/RequestOverview.vue";
import UserOverview from "./views/UserOverview.vue";
import Register from "./views/Register.vue";
import { useAuthStore } from "./store/auth";

const routes = [
    { path: "/", component: Home, meta: { requiresAuth: true }},
    { path: "/login", component: Login },
    { path: "/admin", component: Admin, meta: { requiresAuth: true }},
    { path: "/computers_overview", component: ComputersOverview, meta: { requiresAuth: true }},
    { path: "/reservation_overview", component: ReservationOverview, meta: { requiresAuth: true }},
    { path: "/resource_request", component: ResourceRequest, meta: { requiresAuth: true }},
    { path: "/request_overview", component: RequestOverview, meta: { requiresAuth: true }},
    { path: "/user_overview", component: UserOverview, meta: { requiresAuth: true }},
    { path: "/register", component: Register},

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    // if (authStore.token && !authStore.user) {
    //   await authStore.checkAuth();
    // }
    if (authStore.token && (!authStore.roles || authStore.roles.length === 0)) {
      await authStore.checkAuth();
    }
    if (to.meta.requiresAuth && !authStore.token) {
      next('/login');
    }
    else if (authStore.token && (!authStore.roles || authStore.roles.length === 0) && to.path !== "/register") { // to.path to prevent infinite loop
      next("/register");
    }
    else {
      next();
    }
});
export default router;
