<template>
    <div>
        <!-- <button
            class="fixed top-1/2 right-0 transform -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-l-lg shadow-lg hover:bg-green-600"
            @click="installPWA"
        >
            Install PWA
        </button> -->
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const deferredPrompt = ref(null);
  
  function installPWA() {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt();
      deferredPrompt.value.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
        } else {
          console.log('User dismissed the PWA install prompt');
        }
        deferredPrompt.value = null; // Reset the prompt
      });
    } else {
      alert('PWA installation is not supported or already installed.');
    }
  }
  
  onMounted(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); // Prevent the default install banner
      deferredPrompt.value = e; // Save the event for later use
    });
  });
  </script>
  
  <style scoped>
  /* No additional styling needed - Tailwind handles it all */
  </style>
    