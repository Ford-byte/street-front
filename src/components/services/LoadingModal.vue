<!-- <template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto text-center">
      <h2 class="text-lg font-semibold mb-4 flex justify-center">Loading...</h2>
      <p>Please wait while we process your request.</p>
      <div class="loader mt-4"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const isVisible = ref(props.visible);
const router = useRouter();

watch(() => props.visible, (newValue) => {
  isVisible.value = newValue;
});

// Automatically hide loading modal when navigation is complete
onMounted(() => {
  const handleRouteChange = () => {
    isVisible.value = false;
  };

  router.afterEach(handleRouteChange);

  // Cleanup the event listener on component unmount
  return () => {
    router.afterEach((to, from) => {}); // No-op to remove listener
  };
});
</script>

<style scoped>
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> -->
<template>
  <div>

  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>

</style>
