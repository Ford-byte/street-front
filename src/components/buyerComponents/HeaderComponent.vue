<template>
  <div>
    <nav class="hidden md:flex z-50 relative bg-white shadow-md">
    <div class="flex justify-between w-full items-center h-fit">
      <!-- Logo Section -->
      <div>
        <RouterLink
          to="/"
          aria-label="Back to homepage"
          class="flex items-center p-2"
        >
          <img
            :src="`${backLink}/images/logo.png`"
            alt="Logo"
            class="h-16 mx-4 object-cover"
          />
          <p class="text-2xl font-semibold lato">STREET WEAR</p>
        </RouterLink>
      </div>
      <!-- Navigation Links -->
      <div class="">
        <ul class="flex items-center gap-4">
          <li>
            <RouterLink to="/" class="flex items-center" active-class="active">
              <HomeIcon />
              <span class="px-2 font-bold">HOME</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="cart"
              class="flex items-center"
              active-class="active"
            >
              <Cart />
              <span class="px-2 font-bold">CART</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="purchase"
              class="flex items-center"
              active-class="active"
            >
              <BagIcon />
              <span class="px-2 font-bold">PURCHASE</span>
            </RouterLink>
          </li>
          <li class="relative group">
            <RouterLink
              to="buyersettings"
              class="flex items-center"
              active-class="active"
            >
              <CogsIcon />
            </RouterLink>

            <div
              class="absolute top-8 right-6 px-3 hidden group-hover:flex items-center bg-gray-800 text-white text-sm rounded shadow-lg z-10"
            >
              Settings
            </div>
          </li>

          <li
            @click="LogOut"
            class="relative flex items-center cursor-pointer pr-4 group"
          >
            <LogOutIcon />
            <div
              class="absolute top-8 right-8 px-3 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:flex group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10"
            >
              Logout
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <nav class="fixed bottom-0 w-full bg-white md:hidden z-10">
    <ul
      id="mobile-menu"
      class="flex justify-evenly items-center bg-white border-t"
    >
      <RouterLink
        to="buyerHomepage"
        class="group flex items-center py-4 relative"
        active-class="active"
      >
        <HomeIcon />
        <span
          class="z-50 absolute left-1/5 bottom-12 transform -translate-x-1/2 text-white bg-gray-800 px-4 rounded-md hidden group-hover:flex"
        >
          Home
        </span>
      </RouterLink>

      <RouterLink
        to="cart"
        class="group flex items-center"
        active-class="active"
      >
        <Cart />
        <span
          class="z-50 absolute left-2/5 bottom-12 transform -translate-x-1/2 mt-2 text-white bg-gray-800 px-4 rounded-md hidden group-hover:flex"
        >
          Cart
        </span>
      </RouterLink>
      <RouterLink
        to="purchase"
        class="group flex items-center py-4"
        active-class="active"
      >
        <BagIcon />
        <span
          class="z-50 absolute left-3/5 bottom-12 transform -translate-x-1/2 mt-2 text-white bg-gray-800 px-4 rounded-md hidden group-hover:flex"
        >
          Bag
        </span>
      </RouterLink>
      <RouterLink
        to="buyersettings"
        class="group flex items-center py-4"
        active-class="active"
      >
        <CogsIcon />
        <span
          class="z-50 absolute left-4/5 bottom-12 transform -translate-x-1/2 mt-2 text-white bg-gray-800 px-4 rounded-md hidden group-hover:flex"
        >
          Settings
        </span>
      </RouterLink>
      <div @click="LogOut" class="group flex items-center py-4 cursor-pointer">
        <LogOutIcon />
        <span
          class="z-50 absolute left-5/5 bottom-12 transform -translate-x-1/2 mt-2 text-white bg-gray-800 px-4 rounded-md hidden group-hover:flex"
        >
          Logout
        </span>
      </div>
    </ul>
  </nav>
  </div>
</template>

<script setup>
import { backLink } from "../../../axios";
import { RouterLink } from "vue-router";
import BagIcon from "@/assets/icons/bag.vue";
import CogsIcon from "@/assets/icons/cogs.vue";
import HomeIcon from "@/assets/icons/home.vue";
import Cart from "@/assets/icons/cart.vue";
import LogOutIcon from "@/assets/icons/out.vue";



const LogOut = () => {
  localStorage.removeItem("isLog");
  window.location.reload();
};
</script>

<style scoped>
body.no-scroll {
  overflow: hidden;
}

nav {
  position: relative;
  z-index: 1000;
}

.fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.active {
  color: gray;
  font-weight: bold;
}
</style>