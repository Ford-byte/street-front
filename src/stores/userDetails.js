import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserDetails = defineStore("userinfo", () => {
    // State
    const name = ref("");
    const email = ref("");
    const uid = ref("");
    const number = ref(0);
    const location = ref("");
    const gender = ref("");
    const role = ref("");
    const birthdate = ref("");

    // Actions
    function updateData(data) {
        name.value = data.name;
        email.value = data.email;
        uid.value = data.uid;
        number.value = data.number;
        location.value = data.location;
        gender.value = data.gender;
        role.value = data.role;
        birthdate.value = data.birthdate;
    }

    // Getters
    const data = computed(() => ({
        name: name.value,
        email: email.value,
        uid: uid.value,
        number: number.value,
        location: location.value,
        gender: gender.value,
        role: role.value,
        birthdate: birthdate.value,
    }));

    return {
        updateData,
        data,
    };
});
