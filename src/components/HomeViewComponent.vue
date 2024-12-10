<template>
  <div>
    <BuyerHomepageComponent v-if="role === 'buyer'" />
    <SellerHomepageComponent v-if="role === 'seller'" />
    <AdminHomepageComponent v-if="role === 'admin'" />
    <div v-if="role === 'guest'">Please log in to access the application.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import BuyerHomepageComponent from './buyerComponents/BuyerHomepageComponent.vue';
import SellerHomepageComponent from './users/SellerHomepageComponent.vue';
import AdminHomepageComponent from './users/AdminHomepageComponent.vue';

// Initialize `role` with the value from `localStorage`
const role = ref(localStorage.getItem('role') || 'guest');

const updateRole = () => {
  const storedRole = localStorage.getItem('role');
  if (storedRole === 'admin' || storedRole === 'seller' || storedRole === 'buyer') {
    role.value = storedRole;
  } else {
    role.value = 'guest'; // Default to guest if the role is not recognized
    localStorage.removeItem('role'); // Clear the role in localStorage
  }
};

// Listen for changes to `localStorage`
const onStorageChange = (event) => {
  if (event.key === 'role') {
    updateRole();
  }
};

onMounted(() => {
  window.addEventListener('storage', onStorageChange);
  updateRole(); // Ensure role is updated on mount
});

onUnmounted(() => {
  window.removeEventListener('storage', onStorageChange);
});
</script>
