<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import router from './router';
import Users from './assets/icons/users.vue';
import Store from './assets/icons/store.vue';
import Box from './assets/icons/box.vue';
import Out from './assets/icons/out.vue';
import Dashboard from './assets/icons/dashboard.vue';
import Bag from './assets/icons/bag.vue';
import Envelope from './assets/icons/envelope.vue';
import Bell from './assets/icons/bell.vue';
import Info from './assets/icons/info.vue';

// State management
const role = ref(localStorage.getItem('role'));
const isSidebarOpen = ref(false);

// Handle localStorage changes
const onStorageChange = (event) => {
  const keysToMonitor = ['role', 'isLog', 'isUser', 'Id', 'name'];
  if (keysToMonitor.includes(event.key)) {
    keysToMonitor.forEach(key => localStorage.removeItem(key));
    window.location.reload();
    router.push('/');
  }
};

// Log out function
const logOut = () => {
  localStorage.removeItem('isLog');
  localStorage.removeItem('role');
  role.value = null; // Update local state as well
  window.location.reload();
};

// Lifecycle hooks for event listeners
onMounted(() => {
  window.addEventListener('storage', onStorageChange);
});

onUnmounted(() => {
  window.removeEventListener('storage', onStorageChange);
});

// Toggle sidebar visibility
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar for admin -->
    <div
      class="bg-black h-screen hidden md:block text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out"
      :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }" v-if="role === 'admin'">
      <h1 class="text-3xl font-semibold text-center">Admin Panel</h1>
      <nav class="space-y-2">
        <RouterLink to="/AdminPage"
          class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <!-- <i class="fas fa-users mr-3"></i> -->
          <Users class="mx-2" />
          Customer's List
        </RouterLink>

        <RouterLink to="/seller-list"
          class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <!-- <i class="fas fa-store mr-3"></i> -->
          <Store class="mx-2" />
          Seller's List
        </RouterLink>

        <RouterLink to="/product-list"
          class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <!-- <i class="fas fa-box mr-3"></i> -->
          <Box class="mx-2" />
          Product List
        </RouterLink>

        <RouterLink to="/report-list"
          class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <Info class="mx-2" />
          Report List
        </RouterLink>

        <div @click="logOut" class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <!-- <i class="fas fa-sign-out-alt mr-3"></i> -->
          <Out class="" />
          Log Out
        </div>
      </nav>
    </div>


    <!-- Footer for admin -->
    <div class="bg-black text-white w-full flex md:hidden justify-around py-4 fixed bottom-0" v-if="role === 'admin'">
      <RouterLink to="/AdminPage" class="flex flex-col items-center hover:bg-gray-700 p-2 rounded">
        <!-- Font Awesome icon for Customer's List -->
        <!-- <i class="fas fa-users h-6 w-6"></i> -->
        <Users />
      </RouterLink>

      <RouterLink to="/seller-list" class="flex flex-col items-center hover:bg-gray-700 p-2 rounded">
        <!-- Font Awesome icon for Seller's List -->
        <!-- <i class="fas fa-store h-6 w-6"></i> -->
        <Store />
      </RouterLink>

      <RouterLink to="/product-list" class="flex flex-col items-center hover:bg-gray-700 p-2 rounded">
        <!-- Font Awesome icon for Product List -->
        <!-- <i class="fas fa-box h-6 w-6"></i> -->
        <Box class="mx-2" />
      </RouterLink>

      <div @click="logOut" class="flex flex-col items-center hover:bg-gray-700 p-2 rounded cursor-pointer">
        <!-- Font Awesome icon for Log Out -->
        <!-- <i class="fas fa-sign-out-alt h-6 w-6"></i> -->
        <Out />
      </div>
    </div>




    <!-- Sidebar for seller -->
    <div
      class="bg-black h-screen text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out"
      :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }" v-if="role === 'seller'">
      <h1 class="text-3xl font-semibold text-center">Seller </h1>
      <nav class="space-y-2">
        <RouterLink to="/sellerproductlist"
          class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <!-- <i class="fas fa-tachometer-alt h-5 w-5 mr-3"></i> -->
          <Dashboard />
          Dashboard
        </RouterLink>

        <RouterLink to="/sellerorderlist"
          class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <Bag class="mx-2" />
          Orders
        </RouterLink>

        <RouterLink to="/sellerprofile"
          class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <Info class="mx-2" />
          Profile
        </RouterLink>

        <RouterLink to="/sellermessages"
          class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <Envelope class="mx-2" />
          Notifications
        </RouterLink>

        <div @click="logOut"
          class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 cursor-pointer">
          <Out />
          Log Out
        </div>
      </nav>
    </div>

    <!-- Footer for seller -->
    <div class="bg-black text-white w-full flex md:hidden justify-around py-4 fixed bottom-0" v-if="role === 'seller'">
      <div class="relative group">
        <RouterLink to="/sellerproductlist" class="flex flex-col items-center hover:bg-gray-700 p-2 rounded">
          <Dashboard />
        </RouterLink>
        <span
          class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-auto p-2 text-sm text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Products</span>
      </div>

      <div class="relative group">
        <RouterLink to="/sellerorderlist" class="flex flex-col items-center hover:bg-gray-700 p-2 rounded">
          <Bag />
        </RouterLink>
        <span
          class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-auto p-2 text-sm text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Orders</span>
      </div>
      <RouterLink to="/sellerprofile"
        class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
        <Info/>
        <span
          class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-auto p-2 text-sm text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Profile</span>
      </RouterLink>

      
      <RouterLink to="/sellermessages"
        class="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
        <Envelope/>
        <span
          class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-auto p-2 text-sm text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Notifications</span>
      </RouterLink>

      <div @click="logOut"
        class="relative group flex flex-col items-center hover:bg-gray-700 p-2 rounded cursor-pointer">
        <Out />
        <span
          class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-auto p-2 text-sm text-white bg-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">Logout</span>
      </div>
    </div>




    <!-- Main content -->
    <div class="flex-1 bg-gray-100 flex flex-col">
      <!-- Header -->
      <!-- <header class="bg-black shadow-md p-4 flex items-center justify-between" v-if="role === 'admin'">
        <div class="text-xl font-semibold text-white">Admin</div>
        <div class="flex items-center space-x-4">
          <div class="relative group">
            <button>
              <Envelope />
            </button>
            <span
              class="absolute top-8 left-1/2 transform -translate-x-1/2 w-max p-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">Messages</span>
          </div>

<div class="relative group">
            <button>
              <Bell />
            </button>
            <span
              class="absolute top-8 left-1/2 transform -translate-x-1/2 w-max p-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">Notifications</span>
          </div>
        </div>
      </header> -->
      <RouterView />
    </div>
  </div>
</template>
