import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const logOut = defineStore('logout', () => {
    window.location.reload();
})