<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const users = ref([]);
const roles = ref([]);
const selectedRole = ref('');
const searchQuery = ref('');
const showEditModal = ref(false);
const selectedUser = ref(null);
const selectedUserRoles = ref([]);

const openEditModal = (user) => {
  selectedUser.value = { ...user };
  // selectedUserRoles.value = Array.isArray(user.roles) ? [...user.roles] : user.roles.split(',');
  selectedUserRoles.value = user.roles.split(',');
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedUser.value = null;
  selectedUserRoles.value = [];
  location.reload(); // reload page
};

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users');
    users.value = response.data.map(user => ({
      ...user,
      roles: user.roles || [],
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const fetchRoles = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/roles');
    roles.value = response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

async function addRole(userId, roleId) {
    await axios.post("http://localhost:3000/api/user_roles/assign", { userId, roleId });
}

async function removeRole(userId, roleId) {
    await axios.delete("http://localhost:3000/api/user_roles/remove", { data: { userId, roleId } });
}

const saveUserRoles = async () => {
  if (!selectedUser.value) return;

  try {
    const roleMap = Object.fromEntries(roles.value.map(role => [role.name, role.role_id]));

    console.log("Role Mapping:", roleMap);
    console.log("Selected Roles:", selectedUserRoles.value);
    const originalRoles = selectedUser.value.roles.split(',');

    console.log("Original Roles:", originalRoles);

    const rolesToAdd = selectedUserRoles.value.filter(role => !selectedUser.value.roles.includes(role));
    const rolesToRemove = originalRoles.filter(role => !selectedUserRoles.value.includes(role));

    for (const role of rolesToAdd) {
      const roleId = roleMap[role];
      console.log(`Assigning role: ${role} -> roleId: ${roleId}`);

      if (!roleId) {
        console.warn(`Skipping invalid role: ${role}`);
        continue;
      }

      await addRole(selectedUser.value.user_id, roleId);
    }

    for (const role of rolesToRemove) {
      const roleId = roleMap[role];
      console.log(`Remove role: ${role} -> roleId: ${roleId}`);

      if (!roleId) {
        console.warn(`Skipping invalid role: ${role}`);
        continue;
      }

      await removeRole(selectedUser.value.user_id, roleId);
    }
    selectedUser.value.roles = [...selectedUserRoles.value];
    closeEditModal();
  } catch (error) {
    console.error("Error saving user roles:", error);
  }
};

const toggleRole = (roleName) => {
  if (!selectedUser.value) return;

  if (selectedUserRoles.value.includes(roleName)) {
    selectedUserRoles.value = selectedUserRoles.value.filter(r => r !== roleName);
  } else {
    selectedUserRoles.value.push(roleName);
  }
};


const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesRole = !selectedRole.value || user.roles.includes(selectedRole.value);
    const matchesSearch = user.username?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesRole && matchesSearch;
  });
});

onMounted(() => {
  fetchUsers();
  fetchRoles();
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Lietotāju pārvaldība</h1>
    
    <div class="mb-4">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Meklēt" 
          class="border p-2 w-full"
        />
        <label for="role-filter" class="mr-2">Filtrēt pēc lomas:</label>
        <select id="role-filter" v-model="selectedRole" class="border p-2">
          <option value="">Visi</option>
          <option v-for="role in roles" :key="role.role_id" :value="role.name">
            {{ role.name }}
          </option>
        </select>
    </div>
    
    <table class="w-full border-collapse border border-gray-300">
        <thead>
            <tr class="bg-gray-100">
                <th class="border p-2">E-pasts</th>
                <th class="border p-2">Lietotājvārds</th>
                <th class="border p-2">Lietotāja tips</th>
                <th class="border p-2">Lomas</th>
                <th class="border p-2">Darbība</th>
            </tr>
        </thead>
        <tbody>
        <tr v-for="user in filteredUsers" :key="user.user_id" class="border">
            <td class="border p-2">{{ user.email }}</td>
            <td class="border p-2">{{ user.username || '-' }}</td>
            <td class="border p-2">{{ user.user_type }}</td>
            <td class="border p-2">
                <div class="flex gap-2">
                    <label v-for="role in roles" :key="role.role_id" class="flex items-center gap-1">
                        <input type="checkbox" :checked="user.roles.includes(role.name)" disabled />
                        {{ role.name }}
                    </label>
                </div>
            </td>
            <td class="border p-2">
                <button @click="openEditModal(user)" class="bg-blue-500 text-white px-3 py-1 rounded">Rediģēt</button>
            </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- EDIT MODAL -->
  <div v-if="showEditModal" class="modal-container">
    <div class="modal-content">
      <h2 class="text-lg font-bold mb-4">Rediģēt lietotāju</h2>
      <p><strong>E-pasts:</strong> {{ selectedUser?.email }}</p>
      <p><strong>Lietotājvārds:</strong> {{ selectedUser?.username || '-' }}</p>
      <p><strong>Lietotāja tips:</strong> {{ selectedUser?.user_type }}</p>
      <td class="border p-2">
        <label v-for="role in roles" :key="role.role_id" class="flex items-center gap-1">
          <input 
            type="checkbox" 
            class="toggle-switch"
            :checked="selectedUserRoles.includes(role.name)" 
            @change="toggleRole(role.name)" 
          />
          {{ role.name }}
        </label>
      </td>

      <div class="flex justify-end gap-2 mt-4">
        <button @click="closeEditModal" class="bg-gray-400 text-white px-4 py-2 rounded">Atcelt</button>
        <button @click="saveUserRoles(selectedUser)" class="bg-green-500 text-white px-4 py-2 rounded">Saglabāt</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
html, body {
  overflow: visible !important;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
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
tr:hover {
  background-color: #f0f0f0;
  transition: background-color 0.2s ease-in-out;
}
button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  width: 400px;
}

.toggle-switch {
  appearance: none;
  width: 40px;
  height: 20px;
  background: #ccc;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: background 0.3s;
}

.toggle-switch:checked {
  background: #4CAF50;
}

.toggle-switch::before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 1px;
  left: 2px;
  transition: transform 0.3s;
}

.toggle-switch:checked::before {
  transform: translateX(20px);
}
</style>
