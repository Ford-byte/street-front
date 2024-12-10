<template>
  <div>
    <div
      class="flex items-center justify-center w-full h-full fixed backdrop-blur-md bg-black bg-opacity-50 top-0 z-50 toast-animation-in"
      :class="animationOut == true ? 'toast-animation-out' : ''"
    >
      <!-- Close button in the top right -->
      <span
        class="fixed top-0 left-0 w-full h-full z-10"
        @click="closeTemplate"
      ></span>

      <!-- Login form -->
      <div
        class="bg-card bg-black p-6 rounded-lg shadow-lg w-full max-w-sm relative z-40"
      >
        <div class="w-full flex justify-between items-center">
          <h2 class="text-2xl font-bold text-slate-50 text-center w-full">
            LOG IN
          </h2>
          <div
            @click="closeTemplate()"
            class="text-white cursor-pointer text-2xl z-10"
          >
            <Closewhite />
          </div>
        </div>
        <form class="mt-4" @submit.prevent="handleLogin">
          <label class="block text-slate-50" for="username">EMAIL</label>
          <input
            v-model="loginData.username"
            class="mt-1 p-2 border border-border rounded w-full"
            type="text"
            id="username"
            placeholder="Enter your Email"
            required
          />

          <label class="block text-slate-50 mt-4" for="password"
            >PASSWORD</label
          >
          <div style="position: relative; width: 100%">
            <input
              v-model="loginData.password"
              :type="showPassword ? 'text' : 'password'"
              style="
                padding-right: 2.5rem;
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #ccc;
                border-radius: 4px;
              "
              id="password"
              placeholder="Enter your password"
              required
              aria-label="Password"
              autocomplete="current-password"
            />

            <button
              type="button"
              @click="togglePasswordVisibility"
              style="
                position: absolute;
                top: 50%;
                right: 0.5rem;
                transform: translateY(-50%);
                background: transparent;
                border: none;
                cursor: pointer;
              "
              aria-label="Toggle password visibility"
            >
              <Closeeye v-if="showPassword" />
              <Openeye v-else />
            </button>
          </div>

          <p
            @click="openForgotPassword"
            class="text-slate-50 text-sm hover:underline mt-2 block text-right"
          >
            FORGOT YOUR PASSWORD?
          </p>

          <button
            type="submit"
            class="mt-4 bg-lime-500 text-primary-foreground hover:bg-primary/80 w-full p-2 rounded"
          >
            LOGIN
          </button>
        </form>

        <p class="mt-4 text-slate-50 text-center">
          Don’t have an account?
          <a @click="openRegistration" class="text-accent hover:underline"
            >SIGN UP</a
          >
        </p>
      </div>
    </div>

    <!-- Modals for success, error, and loading states -->
    <SuccessModal
      :visible="showSuccessModal"
      :message="successMessage"
      @close="showSuccessModal = false"
    />
    <ErrorModal
      :visible="showErrorModal"
      :message="errorMessage"
      @close="showErrorModal = false"
      :timeout="1000"
    />
    <LoadingModal :visible="isLoading" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/counter";
import axios from "../../axios";
import ErrorModal from "./services/ErrorModal.vue";
import SuccessModal from "./services/SuccessModal.vue";
import LoadingModal from "./services/LoadingModal.vue";
import Close from "@/assets/icons/close.vue";
import Openeye from "@/assets/icons/openeye.vue";
import Closeeye from "@/assets/icons/closeeye.vue";
import Closewhite from "@/assets/icons/closewhite.vue";

const emit = defineEmits([
  "closeTemplate",
  "openRegistration",
  "openForgotPassword",
]);
const router = useRouter();
const userStore = useUserStore();
const { setToken } = userStore;

const loginData = reactive({
  username: "",
  password: "",
});

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = () => {
  console.log("Submitted password:", loginData.value.password);
};

const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const isLoading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const animationOut = ref(false);

const closeTemplate = () => {
  animationOut.value = true;
  emit("closeTemplate");
};

const openRegistration = () => emit("openRegistration");
const openForgotPassword = () => emit("openForgotPassword");

const handleLogin = async () => {
  showSuccessModal.value = false;
  showErrorModal.value = false;
  isLoading.value = true;

  try {
    const response = await axios.post("/user/login", loginData);

    localStorage.setItem("cart", "[]");
    localStorage.setItem("isLog", response.data.token || "");
    localStorage.setItem("role", response.data.role || "");
    localStorage.setItem("isUser", response.data.isUser || "");
    localStorage.setItem("Id", response.data.id || "");
    localStorage.setItem("name", response.data.name || "");

    setToken(response.data.token);
    successMessage.value = "Login successful!";
    showSuccessModal.value = true;

    setTimeout(() => {
      showSuccessModal.value = false;
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error("Login failed:", error);
    errorMessage.value =
      error.response?.data?.message || "Login failed. Please try again.";
    showErrorModal.value = true;

    // Auto-close error modal after a delay
    setTimeout(() => {
      showErrorModal.value = false;
    }, 1000);
  } finally {
    isLoading.value = false; // Stop loading regardless of success or failure
  }
};

// Clear previous login state on mounted
onMounted(() => {
  // localStorage.removeItem('isLog');
  // localStorage.removeItem('role');
  // localStorage.removeItem('isUser');
  // localStorage.removeItem('Id');
  // localStorage.removeItem('*')
  document.body.style.overflow = "hidden";
  localStorage.clear();
});

// Handle storage changes for session management
const onStorageChange = (event) => {
  if (event.key === "isLog") {
    localStorage.removeItem("isLog");
    window.location.reload(); // Reload the page on logout from other tabs
  }
};

// Listen for storage changes
window.addEventListener("storage", onStorageChange);

// Cleanup event listener on unmounted
onUnmounted(() => {
  window.removeEventListener("storage", onStorageChange);
  document.body.style.overflow = "auto";
});
</script>

<style></style>
