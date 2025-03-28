<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../store/auth";

const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();

const email = authStore.user.email;
const phone_number = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");

const submitRegistration = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const userResponse = await axios.get(`http://localhost:3000/api/users/email/${email}`);
    const user = userResponse.data;

    if (user) {
      await axios.put(`http://localhost:3000/api/users/${user.user_id}`, {
        phone_number: phone_number.value,
        is_active: true,
      });
      const roleId = 1;
      await axios.post('http://localhost:3000/api/user_roles/assign', { userId: user.user_id, roleId });
      
      const rolesResponse = await axios.get(`http://localhost:3000/api/user_roles/${user.user_id}`);
      authStore.roles = rolesResponse.data;
      router.push("/");
    } else {
      errorMessage.value = "Neizdevās atrast lietotāju";
    }
  } catch (error) {
    errorMessage.value = "Neizdevās reģistrācija";
    console.error("Registration error:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Pabeigt reģistrāciju</h1>
    <p class="mb-2">E-pasts: <strong>{{ email }}</strong></p>
    <input v-model="phone_number" placeholder="Phone Number" class="border p-2 w-full mb-2" />
    <button @click="submitRegistration" :disabled="isSubmitting" class="bg-blue-500 text-white px-4 py-2 rounded">
      Reģistrēties
    </button>
    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
  </div>
</template>
