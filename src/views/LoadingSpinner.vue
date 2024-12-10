<template>
  <div class="loading-spinner" v-if="isLoading">
    <div class="spinner"></div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  name: "LoadingSpinner",
  setup() {
    const isLoading = ref(true);

    // Function to disable scrolling
    const disableScroll = () => {
      document.body.style.overflowY = "scroll";
      document.body.style.overflowX = "hidden";
    };

    // Function to enable scrolling
    const enableScroll = () => {
      document.body.style.overflowY = "hidden";
    };

    // Simulate loading process
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);

    // Set up and clean up side effects
    onMounted(() => {
      if (isLoading.value) {
        disableScroll();
      }
    });

    onUnmounted(() => {
      enableScroll();
    });

    return {
      isLoading,
    };
  },
};
</script>
  
  <style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: transparent; /* Make background clear */
  position: absolute; /* Ensure it overlays other content */
  top: 0;
  left: 0;
}

.spinner {
  border: 5px solid rgba(0, 0, 0, 0.1); /* Light gray background */
  border-radius: 50%;
  border-top: 8px solid #3498db; /* Blue color for the spinner */
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
  