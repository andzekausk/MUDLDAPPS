<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const issues = ref([]);
const statuses = ["pending", "solved", "unsolved"];
const selectedStatus = ref("pending");
const filteredIssues = ref([]);
const isModalOpen = ref(false);
const selectedIssue = ref(null);

const fetchIssues = async () => {
    try {
        const response = await api.get(`/issues`);
        issues.value = response.data.issues;
        filterIssues();
    } catch (error) {
        console.error("Failed to fetch issues:", error);
    }
};

const filterIssues = () => {
    if (selectedStatus.value === "all") {
        filteredIssues.value = issues.value;
    } else {
        filteredIssues.value = issues.value.filter(issue => issue.status === selectedStatus.value);
    }
};

const openModal = async (issue) => {
    try {
        const response = await api.get(`/issues/${issue.issue_id}`);
        selectedIssue.value = response.data.issue;
        selectedIssue.value.computers = response.data.computers;
        isModalOpen.value = true;
    } catch (error) {
        console.error("Failed to load issue details:", error);
        alert("Neizdevās ielādēt problēmas datus.");
    }
};


const closeModal = () => {
    isModalOpen.value = false;
    selectedIssue.value = null;
};

const updateIssue = async () => {
    try {
        await api.put(`/issues/${selectedIssue.value.issue_id}/status`, {
            status: selectedIssue.value.status
        });

        for (const comp of selectedIssue.value.computers) {
            await api.put(`/issues/${selectedIssue.value.issue_id}/computer/${comp.computer_id}`, {
                status: comp.status
            });
        }

        const index = issues.value.findIndex(i => i.issue_id === selectedIssue.value.issue_id);
        // if (index !== -1) {
        //     issues.value[index] = { ...selectedIssue.value };
        // }
        if (index !== -1) {
            issues.value[index].status = selectedIssue.value.status;
        }

        alert("Izmaiņas saglabātas!");
        closeModal();
    } catch (error) {
        console.error("Failed to update issue:", error);
        alert("Neizdevās saglabāt izmaiņas.");
    }
};

onMounted(fetchIssues);
</script>

<template>
    <div class="issue-container">
        <h1>Problēmu pārskats</h1>

        <div class="filter-container">
            <label for="statusFilter">Filtrēt pēc statusa:</label>
            <select id="statusFilter" v-model="selectedStatus" @change="filterIssues">
                <option value="all">Visi</option>
                <option v-for="status in statuses" :key="status" :value="status">
                    {{ status }}
                </option>
            </select>
        </div>

        <table>
            <thead>
                <tr>
                    <th>E-pasts</th>
                    <th>Nosaukums</th>
                    <th>Izveidots</th>
                    <th>Statuss</th>
                    <th>Darbība</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="issue in filteredIssues" :key="issue.issue_id">
                    <td>{{ issue.email }}</td>
                    <td>{{ issue.title }}</td>
                    <td>{{ new Date(issue.created_at).toLocaleString() }}</td>
                    <td>{{ issue.status }}</td>
                    <td><button @click="openModal(issue)">Rediģēt</button></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <h2>Rediģēt problēmu</h2>
            <p><strong>E-pasts:</strong> {{ selectedIssue.email }}</p>
            <p><strong>Izveidots:</strong> {{ new Date(selectedIssue.created_at).toLocaleString() }}</p>
            <p><strong>Nosaukums:</strong> {{ selectedIssue.title }}</p>
            <p><strong>Apraksts:</strong> {{ selectedIssue.description }}</p>

            <label for="issue-status">Kopējais statuss:</label>
            <select v-model="selectedIssue.status" id="issue-status">
                <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
            </select>

            <h3>Datoru statusi</h3>
            <ul>
                <li v-for="comp in selectedIssue.computers" :key="comp.computer_id">
                    {{ comp.computer_name }}:
                    <select v-model="comp.status">
                        <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
                    </select>
                </li>
            </ul>

            <div class="modal-actions">
                <button @click="updateIssue">Saglabāt</button>
                <button @click="closeModal">Aizvērt</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.issue-container {
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

th,
td {
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
    min-width: 400px;
    max-width: 600px;
}

.modal-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}
</style>
