<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const requests = ref([]);
const statuses = ["all", "pending", "approved", "denied"];
const selectedStatus = ref("pending");
const fetchRequests = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/requests");
        requests.value = response.data;
    } catch (error) {
        console.error("Failed to fetch requests:", error);
    }
};

const updateStatus = async (requestId, newStatus) => {
    try {
        const request = requests.value.find(r => r.request_id === requestId);
        if (!request) return;
        await axios.put(`http://localhost:3000/api/requests/${requestId}`, {
            information: request.information, 
            status: newStatus 
        });

        request.status = newStatus;
        alert("Status veiksmīgi nomainīts!");
    } catch (error) {
        console.error("Failed to update status:", error);
        alert("Neizdevās nomainīt statusu.");
    }
};

const filteredRequests = computed(() => {
    if (selectedStatus.value === "all") {
        return requests.value;
    }
    return requests.value.filter(request => request.status === selectedStatus.value);
});

onMounted(fetchRequests);
</script>

<template>
    <div class="request-container">
        <h1>Rezervāciju veidošana</h1>

        <div class="filter-container">
            <label for="statusFilter">Filtrēt pēc statusa:</label>
            <select id="statusFilter" v-model="selectedStatus">
                <option v-for="status in statuses" :key="status" :value="status">
                    {{ status }}
                </option>
            </select>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Lietotāja e-pasts</th>
                    <th>Informācija</th>
                    <th>Izveidots</th>
                    <th>Statuss</th>
                    <th>Darbība</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="request in filteredRequests" :key="request.request_id">
                    <td>{{ request.email }}</td>
                    <td>{{ request.information }}</td>
                    <td>{{ new Date(request.created_at).toLocaleString() }}</td>
                    <td>
                        <select v-model="request.status">
                            <option v-for="status in statuses.slice(1)" :key="status" :value="status">
                                {{ status }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <button @click="updateStatus(request.request_id, request.status)">Saglabāt</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.request-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.filter-container {
    margin-bottom: 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}
th {
    background-color: #f4f4f4;
}
button {
    background: #4caf50;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
}
</style>
