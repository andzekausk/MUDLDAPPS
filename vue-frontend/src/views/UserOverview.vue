<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const users = ref([]);
const roles = ['lietotājs', 'pārvaldnieks', 'laborants', 'administrators'];
const selectedRole = ref('');
const searchQuery = ref('');

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users');
    users.value = response.data.map(user => ({
      ...user,
      roles: user.roles ? user.roles.split(',') : []
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
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

onMounted(fetchUsers);
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
        <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
      </select>
    </div>
    
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">E-pasts</th>
          <th class="border p-2">Lietotājvārds</th>
          <th class="border p-2">Lietotāja tips</th>
          <th class="border p-2">Lomas</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id" class="border">
          <td class="border p-2">{{ user.email }}</td>
          <td class="border p-2">{{ user.username || '-' }}</td>
          <td class="border p-2">{{ user.user_type }}</td>
          <td class="border p-2">
            <div class="flex gap-2">
              <label v-for="role in roles" :key="role" class="flex items-center gap-1">
                <input type="checkbox" :checked="user.roles.includes(role)" disabled />
                {{ role }}
              </label>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
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
