<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const computers = ref([]);

const fetchComputers = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/computers");
        computers.value = response.data.computers; 
    } catch (error) {
        console.error("Failed to fetch computers:", error);
    }
};

onMounted(fetchComputers);
</script>

<template>
    <div class="computers-container">
      <h1>Datoru pārskats</h1>
      <div class="computer-cards">
        <div v-for="computer in computers" :key="computer.computer_id" class="computer-card">
          <h2>{{ computer.computer_name }}</h2>
          <p><strong>Komponentes:</strong> {{ computer.components.join(', ') }}</p>
          <div v-for="os in computer.os_details" :key="os.os_name">
            <p><strong>OS:</strong> {{ os.os_name }} ({{ os.os_version }})</p>
            <p><strong>Programmatūra:</strong> 
              {{ os.software.length > 0 ? os.software.join(', ') : "Nav instalēta" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>

<style scoped>
.computers-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.computer-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.computer-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
}
</style>
