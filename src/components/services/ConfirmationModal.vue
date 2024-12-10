<template>
  <transition name="slide" mode="out-in">
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded shadow-lg">
        <p class="mb-4">{{ message }}</p> <!-- Use dynamic message -->
        <div class="w-full flex">
          <button @click="confirm" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full">Yes</button>
          <button @click="cancel" class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full">No</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: Boolean,
  message: String // Add message prop
});
const emit = defineEmits(['confirm', 'cancel']);

function confirm() {
  emit('confirm');
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s, opacity 0.5s;
}
.slide-enter {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  transform: translateX(-100%);
  opacity: 0;
}
</style>


