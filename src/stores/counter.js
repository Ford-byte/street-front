import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

// Counter Store
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});



// User Store
export const useUserStore = defineStore('user', () => {
  const token = ref('');

  function setToken(newToken) {
    token.value = newToken;
  }

  return { token, setToken };
});
