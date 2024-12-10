<template>
  <transition name="slide" mode="out-in">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="bg-gray-900 p-4 rounded">
        <p class="text-white">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  visible: Boolean,
  message: {
    type: String,
    default: 'Action completed successfully!' // Default message
  }
});
const emit = defineEmits(['close']);

let timeoutId = null;

function close() {
  emit('close');
}

// Automatically close the modal after 3 seconds
onMounted(() => {
  timeoutId = setTimeout(() => {
    close();
  }, 1000);
});

// Clear the timeout if the component is unmounted
onBeforeUnmount(() => {
  clearTimeout(timeoutId);
});
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-enter, .slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-leave {
  transform: translateX(0);
  opacity: 1;
}
</style>
