<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../store/auth";
import { jwtDecode } from "jwt-decode";

const authStore = useAuthStore();
const computers = ref([]);
const selectedComputers = ref([]);
const requestInfo = ref("");
const fromTime = ref("");
const toTime = ref("");

const fetchComputers = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/computers");
        computers.value = response.data.computers;
    } catch (error) {
        console.error("Failed to fetch computers:", error);
    }
};

const submitRequest = async () => {
    if (selectedComputers.value.length === 0 || !fromTime.value || !toTime.value) {
        alert("Lūdzu izvēlieties vismaz vienu datoru un laikus.");
        return;
    }
    // Get user_id dynamically from authStore
    const userId = jwtDecode(authStore.token)?.user_id;
    if (!userId) {
        alert("Nevarēja iegūt lietotāja ID. Lūdzu, ielogojieties vēlreiz.");
        return;
    }
    try {
        // create request
        const requestResponse = await axios.post("http://localhost:3000/api/requests", {
            user_id: userId,
            information: requestInfo.value,
            status: "pending"
        });
        
        const requestId = requestResponse.data.request_id;
        
        // create reservation for each computer
        for (const computerId of selectedComputers.value) {
            await axios.post("http://localhost:3000/api/reservations", {
                computer_id: computerId,
                request_id: requestId,
                from_time: fromTime.value,
                to_time: toTime.value
            });
        }

        alert("Pieprasījums veiksmīgi iesniegts!");
        selectedComputers.value = [];
        requestInfo.value = "";
        fromTime.value = "";
        toTime.value = "";
    } catch (error) {
        console.error("Failed to submit request:", error);
        alert("Neizdevās iesniegt pieprasījumu.");
    }
};

onMounted(fetchComputers);
</script>

<template>
    <div class="request-container">
        <h1>Pieteikšanās resursu lietošanai</h1>
        
        <label>Izvēlieties datorus:</label>
        <div class="computer-list">
            <label v-for="computer in computers" :key="computer.computer_id">
                <input type="checkbox" :value="computer.computer_id" v-model="selectedComputers" />
                {{ computer.computer_name }}
            </label>
        </div>
        
        <label>Sākuma datums/laiks:</label>
        <input type="datetime-local" v-model="fromTime" required />

        <label>Beigu datums/laiks:</label>
        <input type="datetime-local" v-model="toTime" required />

        <label>Komentārs:</label>
        <textarea v-model="requestInfo" placeholder="Papildu informācija"></textarea>

        <button @click="submitRequest">Iesniegt pieprasījumu</button>
    </div>
</template>

<style scoped>
.request-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background: #f9f9f9;
}

label {
    display: block;
    margin-top: 10px;
    font-weight: bold;
}

.computer-list {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

input, textarea, button {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
}

button {
    background: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
}
</style>
