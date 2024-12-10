<template>
    <section class="bottom-16 sm:bottom-0 h-full relative">
        <div class="flex flex-col items-center h-full justify-center">
            <div class="flex flex-wrap justify-center items-center">
                <div class="p-4 mt-8 sm:mt-0 mb-8 bg-white text-gray-800 rounded-lg flex flex-col items-center h-full w-[400px] sm:max-w-[560px]"
                    v-for="user in users.response" :key="user.SW_Id">
                    <div class="w-full h-52 md:h-64 lg:h-72 relative flex flex-wrap items-center justify-center">
                        <img v-if="myProfile[0]?.SW_Image" :src="getImageUrl(myProfile[0].SW_Image)"
                            alt="User Profile Image" class="w-full h-full rounded-lg object-cover" />
                        <div v-else class="h-full w-full bg-gray-500 rounded-lg flex justify-center items-center">
                            <input type="file" accept="image/*"
                                class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
                                @change="(event) => handleImageUpload(user.SW_Id, event)" />
                        </div>
                        <button @click="openModal()"
                            class="absolute top-2 right-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M17.414 2.586a2 2 0 00-2.828 0L5 12.172V15h2.828l9.586-9.586a2 2 0 000-2.828zM6 13v-1.172l8.586-8.586 1.172 1.172L7.172 13H6z" />
                            </svg>
                        </button>
                    </div>
                    <div class="text-center space-y-2 mt-4">
                        <h2 class="text-xl lg:text-2xl font-semibold truncate">{{ userInfo[0]?.SW_Fullname || 'N/A' }}
                        </h2>
                        <div class="space-y-1">
                            <p class="text-gray-600 truncate"><strong>Email:</strong> {{ userInfo[0]?.SW_Email || 'N/A'
                                }}</p>
                            <p class="text-gray-600 truncate"><strong>Cellphone Number:</strong> {{
                                userInfo[0]?.SW_Cpnum || 'N/A' }}</p>
                            <p class="text-gray-600 truncate"><strong>Gender:</strong> {{ userInfo[0]?.SW_Gender ||
                                'N/A' }}</p>
                            <p class="text-gray-600"><strong>Location:</strong> {{ getLocation(userInfo[0]) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="userModal"
            class="fixed flex inset-0 items-center justify-center bg-gray-900 bg-opacity-50 toast-animation-in"
            :class="{ 'toast-animation-out': animationOut }" @click="closeModal" @keydown.esc="closeModal" tabindex="0">

            <div class="bg-white rounded-lg shadow-lg w-2/4 mx-4 z-10 overflow-auto max-h-[90vh] flex flex-col"
                @click.stop>
                <div class="flex justify-between items-center p-4 border-b">
                    <h2 class="text-2xl font-semibold">Edit Information</h2>
                    <button @click="closeModal" class="text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="h-6 w-6 cursor-pointer">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                </div>
                <form @submit.prevent="editInformation" class="p-6 grid grid-cols-1 gap-4">
                    <input type="text" class="w-full border p-2 rounded-lg"
                        :placeholder="userInfo[0]?.SW_Fullname || 'Enter name'" v-model="name" required />
                    <input type="text" class="w-full border p-2 rounded-lg"
                        :placeholder="userInfo[0]?.SW_Cpnum || 'Enter cellphone number'" v-model="number" required />
                    <select class="w-full border p-2 rounded-lg" v-model="gender" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <input type="text" id="street" class="w-full border p-2 rounded-lg"
                        :placeholder="userInfo[0]?.SW_Street || 'Enter street'" v-model="street" required />
                    <input type="text" id="city" class="w-full border p-2 rounded-lg"
                        :placeholder="userInfo[0]?.SW_City || 'Enter city'" v-model="city" required />
                    <input type="text" id="province" class="w-full border p-2 rounded-lg"
                        :placeholder="userInfo[0]?.SW_Province || 'Enter province'" v-model="province" required />

                    <div class="flex justify-center mt-4">
                        <input type="submit" value="Submit"
                            class="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
                            :disabled="loading" />
                    </div>
                </form>
            </div>
        </div>

        <div v-if="errorMessage" class="fixed top-0 left-0 right-0 flex justify-center mt-4 z-50">
            <div class="bg-red-500 text-white p-2 rounded">{{ errorMessage }}</div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import axios, { backLink } from '../../../axios';

const users = ref([]);
const id = localStorage.getItem('Id');
const myProfile = ref([]);
const userInfo = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const userModal = ref(false);
const animationOut = ref(false);

const name = ref('');
const number = ref('');
const gender = ref('male');
const street = ref('');
const city = ref('');
const province = ref('');

watch(errorMessage, (newValue) => {
    if (newValue) {
        setTimeout(() => {
            errorMessage.value = '';
        }, 5000);
    }
});

const openModal = () => {
    userModal.value = true;
    setValue();
};

const closeModal = () => {
    animationOut.value = true;
    setTimeout(() => {
        userModal.value = false;
        animationOut.value = false; // Reset animation
    }, 300); // Duration of animation
};

const setValue = () => {
    const profile = myProfile.value[0];
    if (profile) {
        name.value = profile.SW_Fullname;
        number.value = profile.SW_Cpnum;
        gender.value = profile.SW_Gender;
        street.value = profile.SW_Street;
        city.value = profile.SW_City;
        province.value = profile.SW_Province;
    }
};

const fetchData = async () => {
    loading.value = true;
    errorMessage.value = '';

    try {
        const [userResponse, profileResponse, userInfoResponse] = await Promise.all([
            axios.post(`/user/${id}`),
            axios.post(`/user/profile/${id}`),
            axios.get(`/userinfo/${id}`)
        ]);

        users.value = userResponse.data;
        myProfile.value = profileResponse.data.finalResult;
        userInfo.value = userInfoResponse.data.response;
    } catch (error) {
        errorMessage.value = 'Error fetching user data. Please try again later.';
        console.error('Error fetching user data:', error);
    } finally {
        loading.value = false;
    }
};

const getImageUrl = (imagePath) => `${backLink}/images/${imagePath}`;

const handleImageUpload = async (userId, event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('uid', userId);

        try {
            loading.value = true;
            await axios.post('/user/profile', formData);
            await fetchData(); // Refresh data after upload
        } catch (error) {
            errorMessage.value = 'Error uploading image. Please try again.';
            console.error('Error uploading image:', error);
        } finally {
            loading.value = false;
        }
    }
};

const editInformation = async () => {
    loading.value = true;
    try {
        const response = await axios.put(`/user/${id}`, {
            name: name.value,
            number: number.value,
            gender: gender.value,
            street: street.value,
            city: city.value,
            province: province.value
        });

        if (response.status === 200) {
            await fetchData();
            closeModal();
            alert('Information updated successfully!');
        }
    } catch (error) {
        errorMessage.value = 'Failed to update information. Please try again.';
        console.error('Error updating information:', error);
    } finally {
        loading.value = false;
    }
};

const getLocation = (user) => {
    return `${user?.SW_Street || ''}, ${user?.SW_City || ''}, ${user?.SW_Province || ''} City`;
};

onMounted(fetchData);
</script>

<style scoped>
.toast-animation-in {
    animation: fadeIn 0.3s;
}

.toast-animation-out {
    animation: fadeOut 0.3s forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
</style>