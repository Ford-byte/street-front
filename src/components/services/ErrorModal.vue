<template>
  <transition name="slide" mode="out-in">
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-red-500 p-4 rounded shadow-lg text-white">
        <p>{{ message }}</p>
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
    default: 'An error occurred. Please try again.' // Default error message
  },
  timeout: {
    type: Number,
    default: 5000 // Default timeout duration in milliseconds
  }
});
const emit = defineEmits(['close']);

let timeoutId = null;

function close() {
  emit('close');
}

// Automatically close the modal after the specified timeout
onMounted(() => {
  timeoutId = setTimeout(() => {
    close();
  }, props.timeout); // Use the dynamic timeout
});

// Clear the timeout if the component is unmounted
onBeforeUnmount(() => {
  clearTimeout(timeoutId);
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-leave {
  transform: translateX(0);
  opacity: 1;
}
</style>
