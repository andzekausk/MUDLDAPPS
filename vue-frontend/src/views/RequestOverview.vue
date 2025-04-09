<script setup>
import { ref, onMounted, computed } from "vue";
import MultiComputerCalendar from "../components/MultiComputerCalendar.vue";

const requests = ref([]);
const statuses = ["all", "pending", "approved", "denied"];
const selectedStatus = ref("pending");
const isModalOpen = ref(false);
const selectedRequest = ref(null);
const reservations = ref([]);
import api from "../services/api";

const fetchRequests = async () => {
    try {
        const response = await api.get(`/requests`);
        requests.value = response.data;
    } catch (error) {
        console.error("Failed to fetch requests:", error);
    }
};

const fetchReservations = async (requestId) => {
    try {
        const response = await api.get(`/reservations/request/${requestId}`);
        reservations.value = response.data;
    } catch (error) {
        console.error("Failed to fetch reservations:", error);
    }
}

const openModal = async (request) => {
    selectedRequest.value = { ...request };
    await fetchReservations(request.request_id);
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedRequest.value = null;
    reservations.value = [];
};

const updateStatus = async () => {
    try {
        await api.put(`/requests/${selectedRequest.value.request_id}`, {
            information: selectedRequest.value.information,
            status: selectedRequest.value.status
        });

        const index = requests.value.findIndex(r => r.request_id === selectedRequest.value.request_id);
        if (index !== -1) {
            requests.value[index] = { ...selectedRequest.value };
        }

        alert("Status veiksmīgi nomainīts!");
        closeModal();
    } catch (error) {
        console.error("Failed to update status:", error);
        alert("Neizdevās nomainīt statusu.");
    }
};

const uniqueTimeRanges = computed(() => { // prevents duplicate times
    const times = new Set();
    
    reservations.value.forEach(reservation => {
        const timeRange = `${new Date(reservation.from_time).toLocaleString()} - ${new Date(reservation.to_time).toLocaleString()}`;
        times.add(timeRange);
    });

    return [...times];
});

const uniqueComputers = computed(() => { // prevents duplicate computers
    const computers = new Set();
    
    reservations.value.forEach(reservation => {
        computers.add(reservation.computer_name);
    });

    return [...computers];
});

const filteredRequests = computed(() => {
    if (selectedStatus.value === "all") {
        return requests.value;
    }
    return requests.value.filter(request => request.status === selectedStatus.value);
});

const selectedComputers = computed(() => {
    const map = new Map();
    reservations.value.forEach(r => {
        map.set(r.computer_id, {
            computer_id: r.computer_id,
            computer_name: r.computer_name
        });
    });
    return Array.from(map.values());
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
                        {{ request.status }}
                    </td>
                    <td>
                        <button @click="openModal(request)">Rediģēt</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="isModalOpen" class="modal">
        <div class="modal-content horizontal">
            <div class="modal-left">
                <h2>Rediģēt rezervāciju</h2>
                <p><strong>E-pasts:</strong> {{ selectedRequest.email }}</p>
                <p><strong>Izveidots:</strong> {{ new Date(selectedRequest.created_at).toLocaleString() }}</p>
                <p><strong>Informācija:</strong> {{ selectedRequest.information }}</p>
                <p><strong>Rezervācijas laiki:</strong></p>
                <ul>
                    <li v-for="time in uniqueTimeRanges" :key="time">{{ time }}</li>
                </ul>
                <p><strong>Izvēlētie datori:</strong></p>
                <ul>
                    <li v-for="computer in uniqueComputers" :key="computer">{{ computer }}</li>
                </ul>
                
                <label for="status">Statuss:</label>
                <select id="status" v-model="selectedRequest.status">
                    <option v-for="status in statuses.slice(1)" :key="status" :value="status">
                        {{ status }}
                    </option>
                </select>
                <div class="modal-actions">
                    <button @click="updateStatus">Saglabāt</button>
                    <button @click="closeModal">Aizvērt</button>
                </div>
            </div>
            <div class="modal-right">
                <MultiComputerCalendar
                :computers="selectedComputers"
                :reservations="reservations"
                />
            </div>
        </div>
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

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    min-width: 300px;
}

.modal-content.horizontal {
  display: flex;
  gap: 20px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.modal-left {
  flex: 1;
  min-width: 300px;
}

.modal-right {
  flex: 2;
  min-width: 400px;
  max-height: 80vh;
  overflow: auto;
}

.modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
</style>
