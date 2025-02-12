<template>
  <div>
    <nav  v-if="authStore.user">
      <router-link to="/">Datoru pārskats </router-link> |
      <router-link to="/">Apskatīt resursu aizņemtības pārskatu </router-link> |
      <router-link v-if="authStore.currentRole=='lietotājs'" to="/">Pieteikšanās resursu lietošanai </router-link> |
      <router-link v-if="authStore.currentRole=='pārvaldnieks'" to="/">Rezervāciju veidošana </router-link> |
      <router-link v-if="authStore.currentRole!='administrators'" to="/">Pieteikt problēmu </router-link> |
      <router-link v-if="authStore.currentRole=='administrators'" to="/admin">Lietotāju pārvaldība </router-link> | 
      <button v-if="authStore.user" @click="authStore.logout">Logout</button>
      <select v-if="authStore.roles.length > 1" v-model="authStore.currentRole">
      <option v-for="role in authStore.roles" :key="role" :value="role">{{ role }}</option>
      </select>
    </nav>
    <nav v-else>
      <router-link v-if="!authStore.user" to="/login">Login </router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { useAuthStore } from "./store/auth";

export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  }
};
</script>