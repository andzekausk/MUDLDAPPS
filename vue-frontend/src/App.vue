<template>
  <div>
    <nav  v-if="authStore.user">
      <router-link to="/computers_overview">Datoru pārskats </router-link> |
      <router-link to="/reservation_overview">Apskatīt resursu aizņemtības pārskatu </router-link> |
      <router-link v-if="authStore.currentRole=='lietotājs'" to="/resource_request">Pieteikšanās resursu lietošanai </router-link> |
      <router-link v-if="authStore.currentRole=='pārvaldnieks'" to="/request_overview">Rezervāciju veidošana </router-link> |
      <router-link v-if="authStore.currentRole!='administrators'" to="/">Pieteikt problēmu </router-link> |
      <router-link v-if="authStore.currentRole=='administrators'" to="/user_overview">Lietotāju pārvaldība </router-link> | 
      <button v-if="authStore.user" @click="logoutAndRedirect">Logout</button>
      <select v-if="authStore.roles && authStore.roles.length > 1" v-model="authStore.currentRole">
      <option v-for="role in authStore.roles" :key="role" :value="role">{{ role }}</option>
      </select>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { useAuthStore } from "./store/auth";
import { useRouter } from "vue-router"; 

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const logoutAndRedirect = () => {
      authStore.logout();
      router.push("/login"); 
    };

  return { authStore, logoutAndRedirect };
  }
};
</script>