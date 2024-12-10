<template>
  <div>
    <header class="relative" role="banner">
      <div
        class="w-full py-4 flex justify-between items-center text-black sticky bg-white bg-opacity-75"
      >
        <div>
          <RouterLink
            to="/"
            aria-label="Back to homepage"
            class="flex items-center"
          >
            <img
              :src="`${backLink}/images/logo.png`"
              alt="Logo"
              class="h-16 mx-4 object-cover"
            />
            <p class="text-2xl font-semibold lato">STREET WEAR</p>
          </RouterLink>
        </div>

        <nav class="flex space-x-4 monospace" aria-label="Main Navigation">
          <a
            href="#home"
            class="flex items-center px-2 pb-2 hover:border-b-2 border-black transition duration-300 h-full"
            aria-label="Home"
          >
            <HomeIcon />
            <span class="hidden sm:inline items-center h-full">HOME</span>
          </a>
          <a
            href="#products"
            class="px-2 pb-2 hover:border-b-2 border-black transition duration-300 flex items-center"
            aria-label="Products"
          >
            <BagIcon />
            <span class="hidden sm:inline">PRODUCTS</span>
          </a>
          <a
            href="#about"
            class="px-2 pb-2 hover:border-b-2 border-black transition duration-300 flex items-center"
            aria-label="About"
          >
            <InfoIcon />
            <span class="hidden sm:inline">ABOUT</span>
          </a>
        </nav>
      </div>
    </header>

    <!-- Bonus Sale Section -->
    <section
      class="flex justify-center items-center h-ful p-4 md:p-24 md:justify-end relative text-black monospace"
      id="home"
    >
      <img
        :src="`${backLink}/images/bg.png`"
        class="absolute top-0 left-0 z-0 h-full w-full object-cover"
        alt="Background Image"
      />
      <div
        class="border border-black p-12 flex flex-wrap items-center text-center bg-gray-200 opacity-90"
      >
        <div>
          <h2 class="text-6xl tracking-tighter font-bold">
            SHOP NOW!
            <!-- <br class="hidden sm:block">20&#37; Off -->
          </h2>
          <div class="space-x-2 text-center py-4 lg:py-0">
            <span>Click Me!</span>
          </div>
          <div>
            <button
              class="px-5 py-3 rounded-md bg-gray-900 text-white border border-gray-600"
              aria-label="Shop Now"
              @click="showLogin = true"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="mt-12 py-6 sm:py-12 monospace" id="about">
      <div class="text-center text-4xl font-semibold mb-8">
        Why Shop With Us?
      </div>
      <div
        class="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0"
      >
        <div
          class="bg-gray-700 w-72 h-72 rounded-md p-4 m-4 flex flex-col items-center justify-center text-white"
        >
          <div class="text-6xl mb-4">
            <Car />
          </div>
          <div class="text-xl font-semibold">Fast Delivery</div>
          <p class="text-center mt-2">
            We ensure a speedy delivery for every purchase.
          </p>
        </div>
        <div
          class="bg-gray-700 w-72 h-72 rounded-md p-4 m-4 flex flex-col items-center justify-center text-white"
        >
          <div class="text-6xl mb-4">
            <Ship />
          </div>
          <div class="text-xl font-semibold">Free Shipping</div>
          <p class="text-center mt-2">Enjoy free shipping on all orders.</p>
        </div>
        <div
          class="bg-gray-700 w-72 h-72 rounded-md p-4 m-4 flex flex-col items-center justify-center text-white"
        >
          <div class="text-6xl mb-4">
            <Star />
          </div>
          <div class="text-xl font-semibold">Best Quality</div>
          <p class="text-center mt-2">
            We offer products of the highest quality.
          </p>
        </div>
      </div>
    </section>

    <section class="mt-12 py-6 sm:py-12 monospace" id="products">
      <div class="flex justify-center">
        <h2 class="text-6xl tracking-normal font-bold text-center">Our</h2>
        <p
          class="text-6xl tracking-normal font-bold text-center px-2 text-red-500"
        >
          products
        </p>
      </div>
      <div
        class="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0"
      >
        <div
          class="relative bg-gray-700 w-72 h-72 rounded-md m-4 flex flex-col items-center justify-center text-white group"
        >
          <div
            class="flex flex-col items-center justify-center group-hover:blur-sm transition-all duration-300"
          >
            <img
              :src="`${backLink}/images/men.jpg`"
              class="w-72 h-72 rounded-md"
              alt=""
            />
            <p class="absolute bottom-4">Men's apparel</p>
          </div>
          <div
            class="hidden group-hover:flex absolute inset-0 bg-black bg-opacity-50 items-center justify-center text-white p-2 rounded-md transition-all duration-300"
          >
            <button class="bg-red-500 p-2 rounded-md" @click="showLogin = true">
              SIGN IN
            </button>
          </div>
        </div>
        <div
          class="relative bg-gray-700 w-72 h-72 rounded-md m-4 flex flex-col items-center justify-center text-white group"
        >
          <div
            class="flex flex-col items-center justify-center group-hover:blur-sm transition-all duration-300 w-full h-full"
          >
            <img
              :src="`${backLink}/images/women.jpg`"
              class="w-full h-full object-cover rounded-md"
              alt=""
            />
            <p class="absolute bottom-4">Women's apparel</p>
          </div>
          <div
            class="hidden group-hover:flex absolute inset-0 bg-black bg-opacity-50 items-center justify-center text-white p-2 rounded-md transition-all duration-300"
          >
            <button class="bg-red-500 p-2 rounded-md" @click="showLogin = true">
              SIGN IN
            </button>
          </div>
        </div>

        <div
          class="relative bg-gray-700 w-72 h-72 rounded-md m-4 flex flex-col items-center justify-center text-white group"
        >
          <div
            class="flex flex-col items-center justify-center group-hover:blur-sm transition-all duration-300"
          >
            <img
              :src="`${backLink}/images/kid.jpg`"
              class="w-72 h-72 object-cover rounded-md"
              alt=""
            />
            <p class="absolute bottom-4">Kid's apparel</p>
          </div>
          <div
            class="hidden group-hover:flex absolute inset-0 bg-black bg-opacity-50 items-center justify-center text-white p-2 rounded-md transition-all duration-300"
          >
            <button class="bg-red-500 p-2 rounded-md" @click="showLogin = true">
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Login Component -->
    <LoginComponent
      v-if="showLogin"
      @closeTemplate="closeTemplate"
      @openRegistration="openRegistration"
      @openForgotPassword="openForgotPassword"
    />
    <RegistrationComponent v-if="showSignup" @gotoLogin="gotoLogin" />
    <ForgotPasswordComponent v-if="showForgotPassword" @gotoLogin="gotoLogin" />
    <DownloadMe />
  </div>
</template>

<script setup>
import { ref } from "vue";

import LoginComponent from "./LoginComponent.vue";
import RegistrationComponent from "./RegistrationComponent.vue";
import ForgotPasswordComponent from "./ForgotPasswordComponent.vue";

import { backLink } from "../../axios";
import Ship from "../assets/icons/ship.vue";
import Star from "../assets/icons/star.vue";
import Car from "../assets/icons/car.vue";
import HomeIcon from "../assets/icons/home.vue";
import BagIcon from "../assets/icons/bag.vue";
import InfoIcon from "../assets/icons/info.vue";
import DownloadMe from "./DownloadMe.vue";

const showLogin = ref(false);
const showSignup = ref(false);
const showForgotPassword = ref(false);

const closeTemplate = () => {
  setTimeout(() => {
    showLogin.value = false;
  }, 500);
};
const openRegistration = () => {
  document.body.style.overflow = "hidden";
  showLogin.value = false;
  showSignup.value = true;
};
const openForgotPassword = () => {
  document.body.style.overflow = "hidden";
  showLogin.value = false;
  showForgotPassword.value = true;
};

const gotoLogin = () => {
  setTimeout(() => {
    document.body.style.overflow = "hidden";
    showSignup.value = false;
    showForgotPassword.value = false;
    showLogin.value = true;
  }, 100);
};
</script>

<style scoped></style>
