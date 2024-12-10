<template>
  <div v-if="isVisible"
    class="flex items-center justify-center w-full h-full fixed backdrop-blur-md bg-black bg-opacity-50 z-40"
    :class="{ 'toast-animation-in': !animationOut, 'toast-animation-out': animationOut }">

    <span class="fixed top-0 left-0 w-full h-full z-10" @click="gotoLogin"></span>

    <div id="form" class="container h-fit sm:w-3/4 z-40">
      <div class="container w-full bg-white rounded-lg h-full p-4">
        <div class="w-full flex justify-between items-center border-b py-4">
          <h2 class="text-2xl font-semibold">Find your account</h2>
          <button @click="gotoLogin" class="text-gray-500 cursor-pointer text-2xl z-10" aria-label="Close">
            <Close />
          </button>
        </div>

        <form v-if="showFirstForm" @submit.prevent="sendMail" class="grid grid-cols-1 gap-4">
          <div class="p-1 text-lg my-2">
            Please enter your email to search for your account.
          </div>
          <input type="email" class="border w-full px-4 py-2" placeholder="Input your email here..." v-model="email"
            required aria-label="Email" />
          <p v-if="errorMessage" class="text-red-500" aria-live="assertive">{{ errorMessage }}</p>
          <div class="flex w-full justify-center items-center">
            <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-lg">
              Submit
            </button>
          </div>
        </form>

        <!-- Second Form -->
        <div v-if="!showFirstForm" class="p-1 text-lg my-4">
          Enter the OTP and new password to reset your account password.
        </div>
        <form v-if="!showFirstForm" @submit.prevent="changePassword" class="grid grid-cols-1 gap-4">
          <input type="text" class="border w-full px-4 py-2" placeholder="Enter the OTP here" v-model="otp" required
            aria-label="OTP" />
          <input type="password" class="border w-full px-4 py-2" placeholder="Enter New Password" v-model="newPassword"
            required aria-label="New Password" />
          <input type="password" class="border w-full px-4 py-2" placeholder="Confirm New Password"
            v-model="confirmPassword" required aria-label="Confirm Password" />
          <p v-if="passwordError" class="text-red-500" aria-live="assertive">{{ passwordError }}</p>
          <p v-if="passwordSuccess" class="text-green-500" aria-live="assertive">{{ passwordSuccess }}</p>
          <div class="flex w-full justify-center items-center">
            <button type="submit" class="bg-green-500 text-white py-2 px-4 rounded-lg">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Close from '@/assets/icons/close.vue';
import axios from '../../axios';
import { ref } from 'vue';

const emit = defineEmits(["gotoLogin"]);
const animationOut = ref(false);
const isVisible = ref(true);
const email = ref("");
const otp = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const showFirstForm = ref(true);
const errorMessage = ref("");
const passwordError = ref("");
const passwordSuccess = ref("");

const gotoLogin = () => {
  animationOut.value = true; // Start exit animation
  setTimeout(() => {
    emit('gotoLogin');
    isVisible.value = false; // Hide component
  }, 1000); // Match the duration of the exit animation
};

const sendMail = async () => {
  errorMessage.value = ""; // Reset error message
  try {
    const response = await axios.post(`/user/forgotpassword`, { email: email.value });
    showFirstForm.value = false;

    if (response.data.success) { // Ensure response contains a success field
    } else {
      errorMessage.value = response.data.message || "An error occurred. Please try again.";
    }
  } catch (error) {
    console.error("Error:", error.response ? error.response.data.message : error.message);
    errorMessage.value = error.response ? error.response.data.message : "An unexpected error occurred.";
  }
};

const changePassword = async () => {
  passwordError.value = ""; // Reset password error message
  passwordSuccess.value = ""; // Reset success message
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = "Passwords do not match.";
    return;
  }

  try {
    const response = await axios.post(`/user/changePassword`, {
      email: email.value,
      otp: otp.value,
      password: newPassword.value,
    });
    if (response.data?.success) {
      passwordSuccess.value = "Password changed successfully!";
      gotoLogin(); // Redirect to login page after success
    } else {
      passwordError.value = response.data.message || "Failed to change password.";
    }
  } catch (error) {
    console.error("Error changing password:", error.response ? error.response.data.message : error.message);
    passwordError.value = error.response ? error.response.data.message : "An error occurred while changing the password.";
  }
};
</script>

<style scoped>
.toast-animation-in {
  animation: fadeIn 1s forwards;
}

.toast-animation-out {
  animation: fadeOut 1s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>