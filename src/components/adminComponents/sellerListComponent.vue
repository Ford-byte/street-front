<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row md:justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Seller List</h1>
      <div class="mb-4 md:mb-0">
        <div class="flex overflow-hidden rounded-lg dark:bg-gray-50 dark:text-gray-800 w-44 m-4">
          <div class="flex items-center justify-center px-4 dark:bg-gray-600 dark:text-gray-100">
            <Users/>
          </div>
          <div class="flex items-center justify-between flex-1 p-3">
            <p class="text-2xl font-semibold">{{ sellerCount }}</p>
            <p>Sellers</p>
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
              <button @click="openModal(user)" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 m-2">View</button>
              <button @click="confirmDelete(user.SW_Id)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 m-2">Delete</button>
              <button @click="confirmBlock(user.SW_Id)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 m-2">{{user.SW_IsBlocked ? 'Block' : 'Unblock'}}</button>
            </td>
          </tr>
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="4" class="py-3 px-4 text-gray-600 text-center">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between items-center mt-4">
      <button @click="prevPage" :disabled="currentPage === 1" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300">Next</button>
    </div>

    <!-- Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 class="text-xl font-semibold mb-4">View details user</h2>
        <!-- <form @submit.prevent="updateUser"> -->
          <div class="py-3 px-4 justify-center flex">
            <img :src="getImageUrl(currentUser.SW_Image)" alt="User profile picture" class="w-24 h-24 rounded-full object-cover">
          </div>
          <div class="mb-4">
            <strong><label class="block text-gray-700">Name</label></strong>
            <p type="text" class="w-full border border-gray-300 p-2 rounded-md" required >{{ currentUser.SW_Name }}</p>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Email</label>
            <p type="email" class="w-full border border-gray-300 p-2 rounded-md" required >{{ currentUser.SW_Email }}</p>
          </div>
          <div class="flex justify-end">
            <button @click="closeModal" type="button" class="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600">Close</button>
            <!-- <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button> -->
          </div>
        <!-- </form> -->
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal 
      :visible="isDeleteModalOpen" 
      title="Confirm Deletion" 
      message="Are you sure you want to delete this user?" 
      @confirm="deleteUser(userIdToDelete)" 
      @cancel="closeDeleteModal" 
    />
    <ConfirmationModal 
      :visible="BlockModal" 
      title="Confirm Deletion" 
      message="Are you sure you want to delete this user?" 
      @confirm="blockUser(userIdToDelete)" 
      @cancel="closeBlockModal" 
    />
    <SuccessModal 
      :visible="isSuccessModalVisible" 
      :message="successMessage" 
      @close="isSuccessModalVisible = false" 
    />
    <ErrorModal 
      :visible="isErrorModalVisible" 
      :message="errorMessage" 
      @close="isErrorModalVisible = false" 
      :timeout="1500" 
    />
  </div>
</template>

<script setup>
import axios, { backLink } from '../../../axios';
import { ref, computed, onMounted } from 'vue';
import ConfirmationModal from '../../components/services/ConfirmationModal.vue';
import SuccessModal from '../services/SuccessModal.vue';
import ErrorModal from '../services/ErrorModal.vue';
import Users from '@/assets/icons/users.vue';

const isSuccessModalVisible = ref(false);
const isErrorModalVisible = ref(false);
const users = ref([]);
const isModalOpen = ref(false);
const BlockModal = ref(false);
const isDeleteModalOpen = ref(false);
const currentUser = ref({});
const userIdToDelete = ref(null);
const currentPage = ref(1);
const perPage = ref(4);
const profilePicture = 'https://www.dreamstime.com/illustration/default-user.html';
const errorMessage = ref('');
const successMessage = ref('');

const fetchUsers = async () => {
  try {
    const response = await axios.post('/users/seller');
    users.value = response.data.finalResult;
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = 'Error fetching users. Please try again later.';
    console.error('Error fetching users:', error);
  }
};

const getImageUrl = (imagePath) => {
  return imagePath ? `${backLink}/images/${imagePath}` : 'default-image-url';
};

const sellerCount = computed(() => users.value.filter(user => user.SW_Role === 'seller').length);
const totalPages = computed(() => Math.ceil(users.value.length / perPage.value));
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return users.value.slice(start, start + perPage.value);
});

function openModal(user) {
  currentUser.value = { ...user };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  currentUser.value = {};
}

async function updateUser() {
  try {
    await axios.put(`/user/${currentUser.value.SW_Id}`, {
      name: currentUser.value.SW_Name,
      email: currentUser.value.SW_Email,
      birthdate: currentUser.value.SW_Birthdate,
    });

    const index = users.value.findIndex(user => user.SW_Id === currentUser.value.SW_Id);
    if (index !== -1) {
      users.value.splice(index, 1, currentUser.value);
    }

    successMessage.value = "User Updated Successfully";
    isSuccessModalVisible.value = true;

    closeModal();
  } catch (error) {
    console.error('Error updating user:', error);
    errorMessage.value = 'Failed to update user. Please try again.';
    isErrorModalVisible.value = true;
  }
}



function confirmDelete(userId) {
  userIdToDelete.value = userId;
  isDeleteModalOpen.value = true;
}
function confirmBlock(userId) {
  userIdToDelete.value = userId;
  BlockModal.value = true;
}
function closeBlockModal() {
  BlockModal.value = false;
  userIdToDelete.value = null;
}


function closeDeleteModal() {
  isDeleteModalOpen.value = false;
  userIdToDelete.value = null;
}

async function deleteUser(userId) {
  try {
    await axios.delete(`/user/${userId}`);
    deleteProduct(userId);
    users.value = users.value.filter(user => user.SW_Id !== userId);
    successMessage.value = 'User deleted successfully!';
    isSuccessModalVisible.value = true;
    closeDeleteModal();
    setTimeout(()=>{
      isSuccessModalVisible.value = false;
    },1000)
  } catch (error) {
    console.error('Error deleting user:', error);
    errorMessage.value = 'Failed to delete user. Please try again.';
    isErrorModalVisible.value = true;
  }
}

async function blockUser(userId){
   try {
    await axios.delete(`/userBlock/${userId}`);
    users.value = users.value.filter(user => user.SW_Id !== userId);
    successMessage.value = 'Successfully!';
    isSuccessModalVisible.value = true;
    deleteProduct(userId)
    closeBlockModal();
    setTimeout(()=>{
      isSuccessModalVisible.value = false;
    },1000)
  } catch (error) {
    console.error('Error deleting user:', error);
    errorMessage.value = 'Failed to delete user. Please try again.';
    isErrorModalVisible.value = true;
  }
}

const deleteProduct = async (userId) => {
    try {
        await axios.delete(`/allproduct/${userId}`);
        closeDeleteModal();
        handleSuccess('Product deleted successfully.');
    } catch {
        handleError('Error deleting product. Please try again.');
    }
};

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* Add any scoped styles here if necessary */
</style>
