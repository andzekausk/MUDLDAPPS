<template>
  <div>
    <h2>Administratora lapa</h2>
    <p v-if="currentRole=='administrators'">Sveiks, admin!</p>
    <p v-else>Nedrīkst!</p>
  </div>
</template>

<script>
import { computed } from "vue";
import { useAuthStore } from "./../store/auth";

export default {
  setup() {
    const authStore = useAuthStore();
    const currentRole = computed(() => authStore.currentRole);
    return{currentRole};
  }
};
</script>
