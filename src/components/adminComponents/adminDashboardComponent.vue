<template>
  <!-- <SidebarModal /> -->
  <div class="container mx-auto p-4 float-right">

    <div class="flex flex-col md:flex-row md:justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Customer List</h1>
      <div class="mb-4 md:mb-0">
        <div class="flex overflow-hidden rounded-lg dark:bg-gray-50 dark:text-gray-800 w-44 m-4">
          <div class="flex items-center justify-center px-4 dark:bg-gray-600 dark:text-gray-100">
            <!-- SVG Icon -->
            <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="w-6 h-6">
              <path
                d="M462.541,316.3l-64.344-42.1,24.774-45.418A79.124,79.124,0,0,0,432.093,192V120A103.941,103.941,0,0,0,257.484,43.523L279.232,67a71.989,71.989,0,0,1,120.861,53v72a46.809,46.809,0,0,1-5.215,21.452L355.962,284.8l89.058,58.274a42.16,42.16,0,0,1,19.073,35.421V432h-72v32h104V378.494A74.061,74.061,0,0,0,462.541,316.3Z">
              </path>
              <path
                d="M318.541,348.3l-64.343-42.1,24.773-45.418A79.124,79.124,0,0,0,288.093,224V152A104.212,104.212,0,0,0,184.04,47.866C126.723,47.866,80.093,94.581,80.093,152v72a78,78,0,0,0,9.015,36.775l24.908,45.664L50.047,348.3A74.022,74.022,0,0,0,16.5,410.4L16,496H352.093V410.494A74.061,74.061,0,0,0,318.541,348.3ZM320.093,464H48.186l.31-53.506a42.158,42.158,0,0,1,19.073-35.421l88.682-58.029L117.2,245.452A46.838,46.838,0,0,1,112.093,224V152a72,72,0,1,1,144,0v72a46.809,46.809,0,0,1-5.215,21.452L211.962,316.8l89.058,58.274a42.16,42.16,0,0,1,19.073,35.421Z">
              </path>
            </svg> -->
            <Users />
          </div>
          <div class="flex items-center justify-between flex-1 p-3">
            <p class="text-2xl font-semibold">{{ customerCount }}</p>
            <p>Customers</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr class="bg-gray-100 border-b">
            <th class="py-3 px-4 text-left text-gray-600 font-medium">No</th>
            <th class="py-3 px-4 text-left text-gray-600 font-medium">Name</th>
            <th class="py-3 px-4 text-left text-gray-600 font-medium">Email</th>
            <th class="py-3 px-4 text-left text-gray-600 font-medium flex justify-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.SW_Id" class="border-b hover:bg-gray-50">
            <td class="py-3 px-4 text-gray-800">{{ index + 1 }}</td>
            <td class="py-3 px-4 text-gray-800">{{ user.SW_Name }}</td>
            <td class="py-3 px-4 text-gray-600">{{ user.SW_Email }}</td>
            <td class="py-3 px-4">

              <button @click="openUserDetailsModal(user)"
                class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 m-2">View</button>
              <button @click="showDeleteModal(user)"
                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 m-2 z-40">Delete</button>
            </td>
          </tr>
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="4" class="py-3 px-4 text-gray-600 text-center">No users found</td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-between items-center mt-4">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300">Next</button>
      </div>

      <ConfirmationModal :visible="isModalVisible" title="Confirm Deletion"
        message="Are you sure you want to delete this user?" @confirm="handleDelete" @cancel="closeDeleteModal" />

      <SuccessModal :visible="isSuccessModalVisible" :message="successMessage" @close="isSuccessModalVisible = false" />

      <ErrorModal :visible="isErrorModalVisible" :message="errorMessage" @close="isErrorModalVisible = false"
        :timeout="1500" />

      <UserDetailsModal :visible="isUserDetailsModalVisible" :user="currentUser" @close="closeUserDetailsModal" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '../../../axios';
import ConfirmationModal from '../../components/services/ConfirmationModal.vue';
import SuccessModal from '../services/SuccessModal.vue';
import ErrorModal from '../services/ErrorModal.vue';
// import SidebarModal from '../services/SidebarModal.vue';
import UserDetailsModal from '../services/UserDetailsModal.vue';
import Users from '@/assets/icons/users.vue';

const users = ref([]);
const currentUser = ref({});
const isUserDetailsModalVisible = ref(false);
const currentPage = ref(1);
const perPage = 4;
const errorMessage = ref('');
const successMessage = ref('');
const isModalVisible = ref(false);
const isSuccessModalVisible = ref(false);
const isErrorModalVisible = ref(false);
const userIdToDelete = ref(null);

const fetchUsers = async () => {
  try {
    const response = await axios.post('/users/buyer');
    users.value = response.data.finalResult;
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = 'Error fetching users. Please try again later.';
    console.error('Error fetching users:', error);
  }
};

const customerCount = computed(() => users.value.filter(user => user.SW_Role === 'buyer').length);
const totalPages = computed(() => Math.ceil(users.value.length / perPage));
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return users.value.slice(start, start + perPage);
});

// function openModal(user) {
//   currentUser.value = { ...user };
// }

// function closeModal() {
//   currentUser.value = {};
// }

const deleteUser = ref(null)

const showDeleteModal = (user) =>{
  isModalVisible.value = true;
  deleteUser.value = user.SW_Id;
}

function openUserDetailsModal(user) {
  currentUser.value = { ...user };
  isUserDetailsModalVisible.value = true;
}

function closeUserDetailsModal() {
  isUserDetailsModalVisible.value = false;
  currentUser.value = {};
}

const handleDelete = () => {
  try {
    const response = axios.delete(`/user/${deleteUser.value}`);
    if (response) successMessage.value = "User successfully deleted"
  } catch (error) {
    errorMessage.value = error.message;
  }
}


onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
