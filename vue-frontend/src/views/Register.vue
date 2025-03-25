<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const email = route.query.email;
const phone_number = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");

const submitRegistration = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    let userId;
    let roleId = 1; // change this later
    const userResponse = await axios.post('http://localhost:3000/api/users', {
      email,
      user_type: "google",
      phone_number: phone_number.value,
      is_active: true,
    });
    if (userResponse.data.user_id) {
        userId = userResponse.data.user_id;
        await axios.post('http://localhost:3000/api/user_roles/assign', { userId, roleId});
    }
    router.push("/");
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
