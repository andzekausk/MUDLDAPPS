<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const computers = ref([]);
const showModal = ref(false);
const showEditModal = ref(false);

const newComputer = ref({
  name: "",
  description: "",
  row: "",
  column: "",
});

const editedComputer = ref({
  computer_id: null,
  name: "",
  description: "",
  row: "",
  column: "",
});

const fetchComputers = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/computers");
        computers.value = response.data.computers; 
    } catch (error) {
        console.error("Failed to fetch computers:", error);
    }
};

const addComputer = async () => {
  try {
    await axios.post("http://localhost:3000/api/computers", newComputer.value);
    showModal.value = false;
    fetchComputers();
    newComputer.value = { name: "", description: "", row: "", column: "" }; 
  } catch (error) {
    console.error("Failed to add computer:", error);
  }
};

const deleteComputer = async (computerId) => {
    try {
        await axios.delete(`http://localhost:3000/api/computers/${computerId}`);
        computers.value = computers.value.filter(c => c.computer_id !== computerId);
        alert("Dators veiksmīgi izdzēsts!");
    } catch (error) {
        console.error("Error deleting computer:", error);
        alert("Kļūda dzēšot datoru!");
    }
};

const confirmDelete = (computerId) => {
    if (confirm("Vai tiešām vēlies dzēst šo datoru?")) {
        deleteComputer(computerId);
    }
};


const editComputer = (computer) => {
  editedComputer.value = {
    computer_id: computer.computer_id,
    name: computer.computer_name,
    description: computer.description || "",
    row: computer.comp_row,
    column: computer.comp_col
  };
  showEditModal.value = true;
};

const updateComputer = async () => {
  try {
    await axios.put(
      `http://localhost:3000/api/computers/${editedComputer.value.computer_id}`,
      editedComputer.value
    );
    showEditModal.value = false;
    fetchComputers();
  } catch (error) {
    console.error("Failed to update computer:", error);
  }
};

onMounted(fetchComputers);
</script>

<template>
  
    <div class="computers-container">
      <h1>Datoru pārskats</h1>

      <button @click="showModal = true" class="add-button">Pievienot datoru</button>

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
          <button @click="editComputer(computer)" class="edit-btn">Rediģēt</button>
          <button @click="confirmDelete(computer.computer_id)" class="delete-btn">Dzēst</button>
        </div>
      </div>

      <!-- add modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h2>Pievienot jaunu datoru</h2>
          <label>Nosaukums:</label>
          <input v-model="newComputer.name" type="text" required />
          
          <label>Apraksts:</label>
          <input v-model="newComputer.description" type="text" />
          
          <label>Rinda:</label>
          <input v-model="newComputer.row" type="number" required />
          
          <label>Kolonna:</label>
          <input v-model="newComputer.column" type="number" required />

          <button @click="addComputer">Pievienot</button>
          <button @click="showModal = false" class="close-button">Aizvērt</button>
        </div>
      </div>

      <!-- edit modal -->
      <div v-if="showEditModal" class="modal-overlay">
        <div class="modal">
          <h2>Rediģēt datoru</h2>
          <label>Nosaukums:</label>
          <input v-model="editedComputer.name" type="text" required />

          <label>Apraksts:</label>
          <input v-model="editedComputer.description" type="text" />

          <label>Rinda:</label>
          <input v-model="editedComputer.row" type="number" required />

          <label>Kolonna:</label>
          <input v-model="editedComputer.column" type="number" required />

          <button @click="updateComputer">Saglabāt</button>
          <button @click="showEditModal = false" class="close-button">Aizvērt</button>
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

.add-button {
  padding: 10px 15px;
  margin-bottom: 10px;
  background: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
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

/* Modal window */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}

.close-button, .edit-btn, .delete-btn {
  padding: 8px;
  margin: 5px;
  border: none;
  cursor: pointer;
}

.edit-btn {
  background: #008cba;
  color: white;
}

.delete-btn {
  background: red;
  color: white;
}

.delete-btn:hover {
  background: darkred;
}

.edit-btn:hover {
  background: #005f7a;
}

</style>
