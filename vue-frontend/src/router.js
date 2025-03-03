import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import Admin from "./views/Admin.vue";
import ComputersOverview from "./views/ComputersOverview.vue";
import ReservationOverview from "./views/ReservationOverview.vue";
import ResourceRequest from "./views/ResourceRequest.vue";
import { useAuthStore } from "./store/auth";

const routes = [
    { path: "/", component: Home, meta: { requiresAuth: true }},
    { path: "/login", component: Login },
    { path: "/admin", component: Admin, meta: { requiresAuth: true }},
    { path: "/computers_overview", component: ComputersOverview, meta: { requiresAuth: true }},
    { path: "/reservation_overview", component: ReservationOverview, meta: { requiresAuth: true }},
    { path: "/resource_request", component: ResourceRequest, meta: { requiresAuth: true }}

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
