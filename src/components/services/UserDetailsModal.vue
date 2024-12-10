<template>
    <div v-if="visible" class="modal-overlay">
      <div class="modal-content">
        <h2 class="text-xl font-semibold p-2">{{ user.SW_Name }}</h2>
        <p class="p-2">Email: {{ user.SW_Email }}</p>
        <p class="p-2">Birthdate: {{ user.SW_Birthdate }}</p>
        <button @click="$emit('close')" class="bg-blue-500 text-white px-4 py-2 rounded flex justify-center items-center">Close</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  defineProps(['visible', 'user']);
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
  }
  </style>
  