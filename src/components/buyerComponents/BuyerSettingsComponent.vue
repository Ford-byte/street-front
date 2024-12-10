<template>
  <div>
    <HeaderComponent />
    <section
      class="w-full h-full bg-gray-900 flex justify-center items-center p-4 fixed"
    >
      <div
        class="p-2 sm:p-4 sm:my-2 mb-12 lg:mb-0 bg-white text-gray-800 rounded-sm flex flex-col items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
        v-for="user in users.response"
        :key="user.SW_Id"
      >
        <div class="w-full h-52 relative">
          <img
            v-if="myProfile[0]?.SW_Image"
            :src="getImageUrl(myProfile[0].SW_Image)"
            alt="User Profile Image"
            class="w-full h-full rounded-sm object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gray-500 rounded flex justify-center items-center dark:bg-gray-700"
          >
            <input
              type="file"
              accept="image/*"
              class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
              @change="(event) => handleImageUpload(user.SW_Id, event)"
            />
          </div>

          <button
            @click="openModal()"
            class="absolute top-2 right-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M17.414 2.586a2 2 0 00-2.828 0L5 12.172V15h2.828l9.586-9.586a2 2 0 000-2.828zM6 13v-1.172l8.586-8.586 1.172 1.172L7.172 13H6z"
              />
            </svg>
          </button>
        </div>

        <div class="text-center space-y-4 mt-4">
          <h2 class="text-2xl md:text-3xl font-semibold truncate">
            {{ userInfo[0]?.SW_Fullname || "N/A" }}
          </h2>
          <div class="space-y-2">
            <p class="text-gray-600 dark:text-gray-500 truncate">
              <strong>Email:</strong> {{ userInfo[0]?.SW_Email || "N/A" }}
            </p>
            <p class="text-gray-600 dark:text-gray-500 truncate">
              <strong>Cellphone Number:</strong>
              {{ userInfo[0]?.SW_Cpnum || "N/A" }}
            </p>
            <p class="text-gray-600 dark:text-gray-500 truncate">
              <strong>Gender:</strong> {{ userInfo[0]?.SW_Gender || "N/A" }}
            </p>
            <p
              class="text-gray-600 dark:text-gray-500 flex flex-wrap w-full text-center justify-center"
            >
              <strong>Location:</strong>
              {{
                `${userInfo[0]?.SW_Street}, ${userInfo[0]?.SW_City},
                        ${userInfo[0]?.SW_Province} City`
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal for editing user information -->
    <div
      id="userModal"
      v-if="userModal"
      class="fixed flex inset-0 items-center justify-center bg-gray-900 bg-opacity-50 toast-animation-in"
      :class="{ 'toast-animation-out': animationOut }"
      @click="closeModal"
      @keydown.esc="closeModal"
      tabindex="0"
    >
      <div
        class="bg-white rounded-lg shadow-lg max-w-lg w-full z-10 overflow-auto max-h-[500px]"
        @click.stop
      >
        <div class="w-full grid grid-cols-4 gap-4 p-6">
          <div class="flex col-span-4 justify-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 cursor-pointer"
              @click="closeModal"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <form
            @submit.prevent="editInformation"
            class="col-span-4 grid grid-cols-4 gap-4"
          >
            <h2 class="text-2xl font-semibold col-span-4 mx-2">
              Edit Information
            </h2>

            <div class="col-span-4">
              <input
                type="text"
                class="w-full border p-2 rounded-lg"
                :placeholder="userInfo[0]?.SW_Fullname || 'Enter name'"
                v-model="name"
                required
              />
            </div>

            <!-- <div class="col-span-4">
                        <input type="email" class="w-full border p-2 rounded-lg"
                            :placeholder="userInfo[0]?.SW_Email || 'Enter email'" v-model="email" required />
                    </div> -->

            <div class="col-span-4 sm:col-span-2">
              <input
                type="text"
                class="w-full border p-2 rounded-lg"
                :placeholder="
                  '0' + userInfo[0]?.SW_Cpnum || 'Enter cellphone number'
                "
                v-model="number"
                required
              />
            </div>

            <div class="col-span-4 sm:col-span-2">
              <select
                class="w-full border p-2 rounded-lg"
                v-model="gender"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div class="col-span-4">
              <input
                type="text"
                id="street"
                class="w-full border p-2 rounded-lg"
                :placeholder="userInfo[0]?.SW_Street || 'Enter street'"
                v-model="street"
                required
              />
            </div>

            <div class="col-span-4">
              <input
                type="text"
                id="city"
                class="w-full border p-2 rounded-lg"
                :placeholder="userInfo[0]?.SW_City || 'Enter city'"
                v-model="city"
                required
              />
            </div>

            <div class="col-span-4">
              <input
                type="text"
                id="province"
                class="w-full border p-2 rounded-lg"
                :placeholder="userInfo[0]?.SW_Province || 'Enter province'"
                v-model="province"
                required
              />
            </div>

            <div class="col-span-4 flex justify-center mt-2">
              <input
                type="submit"
                value="Submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
                :disabled="loading.value"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div
      v-if="loading"
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
    >
      <div class="text-white">Loading...</div>
    </div>

    <!-- Error Message Display -->
    <div
      v-if="errorMessage"
      class="fixed top-0 left-0 right-0 flex justify-center mt-4 z-50"
    >
      <div class="bg-red-500 text-white p-2 rounded">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import axios, { backLink } from "../../../axios";
import HeaderComponent from "./HeaderComponent.vue";

const users = ref([]);
const id = localStorage.getItem("Id");
const myProfile = ref([]);
const userInfo = ref([]);
const loading = ref(true);
const errorMessage = ref("");
const userModal = ref(false);
const animationOut = ref(false);

const name = ref("");
const email = ref("");
const number = ref("");
const gender = ref("");
const street = ref("");
const city = ref("");
const province = ref("");

watch(errorMessage, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      errorMessage.value = "";
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
  if (myProfile.value.length > 0) {
    name.value = myProfile.value[0].SW_Fullname;
    email.value = localStorage.getItem("isUser");
    number.value = myProfile.value[0].SW_Cpnum;
    gender.value = myProfile.value[0].SW_Gender;
    street.value = myProfile.value[0].SW_Street;
    city.value = myProfile.value[0].SW_City;
    province.value = myProfile.value[0].SW_Province;
  }
};

const fetchData = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const [userResponse, profileResponse, userInfoResponse] = await Promise.all(
      [
        axios.post(`/user/${id}`),
        axios.post(`/user/profile/${id}`),
        axios.get(`/userinfo/${id}`),
      ]
    );
    users.value = userResponse.data;
    myProfile.value = profileResponse.data.finalResult;
    userInfo.value = userInfoResponse.data.response;
  } catch (error) {
    errorMessage.value = "Error fetching user data. Please try again later.";
    console.error("Error fetching user data:", error);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (imagePath) => `${backLink}/images/${imagePath}`;

const handleImageUpload = async (userId, event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("uid", userId);

    try {
      loading.value = true;
      await axios.post("/user/profile", formData);
      await fetchData(); // Refresh data after upload
    } catch (error) {
      errorMessage.value = "Error uploading image. Please try again.";
      console.error("Error uploading image:", error);
    } finally {
      loading.value = false;
    }
  }
};

const editInformation = async () => {
  try {
    loading.value = true;
    const response = await axios.put(`/user/${id}`, {
      name: name.value,
      email: email.value,
      number: number.value,
      gender: gender.value,
      street: street.value,
      city: city.value,
      province: province.value,
    });
    if (response.status === 200) {
      userInfo.value = response.data;
      await fetchData();
      closeModal();
      alert("Information updated successfully!");
    }
  } catch (error) {
    errorMessage.value = "Failed to update information. Please try again.";
    console.error("Error updating information:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Add CSS animations for modal transitions */
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
