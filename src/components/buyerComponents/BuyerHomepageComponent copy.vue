<template>
  <div>
    <!-- <HeaderComponent /> -->
    <nav class="hidden md:flex z-50 sticky top-0 bg-white shadow-md">
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
        <div class="flex items-center">
          <input
            type="search"
            v-model="searchInput"
            @input="getProductsByCategory"
            class="p-2 max-w-full rounded-md text-black bg-white border border-gray-300 shadow focus:outline-none focus:ring focus:ring-gray-500 transition hover:cursor-pointer"
            placeholder="Search..."
          />
        </div>

        <!-- Navigation Links -->
        <div class="">
          <ul class="flex items-center gap-4">
            <li>
              <RouterLink
                to="dashboard"
                class="flex items-center"
                active-class="active"
              >
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

    <section class="hidden sm:block bg-black overflow-visible py-12">
      <div class="text-white items-center text-center flex flex-col mx-4">
        <h2 class="font-bold text-xl md:text-3xl lg:text-xl">
          Embark on an Adventure
        </h2>
        <p
          class="mx-auto mt-6 max-w-xl text-lg md:text-2xl leading-8 text-slate-400"
        >
          Take a thrilling journey through our product's features. Book an
          adventurous demo and discover endless possibilities.
        </p>
      </div>
    </section>

    <section class="bg-gray-900 text-white">
      <div class="w-full flex md:hidden p-2">
        <input
          v-model="searchInput"
          @input="getProductsByCategory"
          class="p-2 rounded-md w-full text-black bg-white border border-gray-300 shadow focus:outline-none focus:ring focus:ring-gray-500 transition hover:cursor-pointer"
          placeholder="Search..."
        />
      </div>
      <div class="flex justify-center items-center">
        <h2 class="text-3xl sm:text-5xl font-bold py-4 md:py-2">
          LATEST PRODUCTS
        </h2>
      </div>
      <div class="relative overflow-hidden mx-auto">
        <div
          class="carousel-wrapper sm:w-full flex transition-transform duration-700 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div
            v-for="(product, index) in products"
            :key="product.SW_Id"
            class="carousel-item bg-gray-200 p-6 shadow-lg text-center flex-none w-full md:w-1/3 cursor-pointer transform transition-transform duration-300"
          >
            <img
              :alt="product.SW_Name"
              :src="getImageUrl(product.SW_Images)"
              @click="openModal(product, index)"
              class="mx-auto mb-4 border-2 border-gray-700 mt-12"
            />
            <h3 class="text-xl font-semibold mb-2 uppercase text-black">
              {{ product.SW_Name }}
            </h3>
            <p class="text-gray-700 font-semibold uppercase">
              {{ "₱" + product.SW_Price }}
            </p>
          </div>
        </div>
        <button
          @click="prevSlide"
          class="carousel-nav-button bg-gray-800 left-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          @click="nextSlide"
          class="carousel-nav-button bg-gray-800 right-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div v-if="selectedProduct" class="modal-overlay z-20">
        <span
          class="fixed top-0 left-0 w-full h-full bg-black opacity-50"
          @click="closeModal"
        ></span>
        <div
          class="modal-content flex h-full justify-center items-center z-10 inset-0"
        >
          <div class="mt-24">
            <div class="">
              <div>
                <!-- <div v-for="(product, index) in paginatedProducts" :key="product.SW_Name"> -->
                <div>
                  <!-- <img
                    :src="getImageUrl(selectedProduct.SW_Images)"
                    :alt="selectedProduct.SW_Name"
                    class="modal-image"
                  /> -->
                  <div>
                    <div v-if="currentImages.length > 0" class="image-viewer">
                      <img
                        :src="getImageUrl(currentImages[currentImageIndex])"
                        :alt="selectedProduct.SW_Name"
                        class="modal-image"
                      />
                      <div class="flex items-center justify-center my-2 gap-3">
                        <button
                          @click="prevImage"
                          :disabled="currentImageIndex === 0"
                          class="nav-button border hover:bg-white hover:text-gray-900 px-2 py-0.5 rounded-full"
                        >
                          ←
                        </button>
                        <div>{{ "1/" + (productIndex+1) }}</div>
                        <button
                          @click="nextImage"
                          :disabled="
                            currentImageIndex === currentImages.length - 1
                          "
                           class="nav-button border hover:bg-white hover:text-gray-900 px-2 py-0.5 rounded-full"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                  {{ selectedProduct.SW_Name }}
                </div>

                <!-- <div
                  class="pagination w-full flex justify-center items-center py-4"
                >
                  <button
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="p-2 rounded-lg bg-blue-500"
                  >
                    {{ "<" }}
                  </button>
                  <span>Page {{ currentPage }} / {{ totalPages }}</span>
                  <button
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="p-2 rounded-lg bg-blue-500"
                  >
                    {{ ">" }}
                  </button>
                </div> -->
              </div>
              <!-- <RouterLink :to="`/pages/product/${selectedProduct.SW_Id}`"
                            class="hover:underline text-blue-500 hover:text-blue-800">
                            <p>View</p>
                        </RouterLink> -->

              <div v-if="selectedSize" class="size-indicator">
                Size: {{ selectedSize }} , Stock Available
                {{
                  selectSize == "S"
                    ? selectedProduct.SW_Small
                    : selectSize == "M"
                    ? selectedProduct.SW_Medium
                    : selectSize == "L"
                    ? selectedProduct.SW_Large
                    : selectedProduct.SW_X_large
                }}
              </div>
            </div>
            <h2 class="text-2xl font-bold mt-2">{{ formattedPrice }}</h2>
            <p
              v-if="canceledMinPrice && canceledMaxPrice"
              class="line-through text-gray-400"
            >
              {{ canceledMinPrice }} - {{ canceledMaxPrice }}
            </p>
            <div class="mt-4">
              <h3 class="font-semibold">Size</h3>
              <div class="flex flex-wrap gap-2 mt-2">
                <button
                  v-for="size in productSizes"
                  :key="size"
                  :disabled="getSizes(size)"
                  :class="{
                    'bg-primary': selectedSize === size,
                    'bg-secondary': selectedSize !== size,
                  }"
                  class="text-secondary-foreground px-3 py-1 rounded"
                  @click="selectSize(size)"
                >
                  {{ size }}
                </button>
              </div>
            </div>
            <div class="mt-4 flex items-center">
              <h3 class="font-semibold">Quantity</h3>
              <div class="flex items-center ml-4">
                <button
                  class="bg-secondary text-secondary-foreground px-2 py-1 rounded"
                  @click="decreaseQuantity"
                >
                  -
                </button>
                <span class="mx-2">{{ selectedQuantity }}</span>
                <button
                  class="bg-secondary text-secondary-foreground px-2 py-1 rounded"
                  @click="increaseQuantity"
                  :disabled="getQuantity(selectedQuantity)"
                >
                  +
                </button>
              </div>
            </div>

            <div class="mt-6 flex justify-between items-center">
              <button
                class="bg-secondary px-4 py-2 text-xs sm:text-md rounded"
                @click="addOnCart"
              >
                Add to cart
              </button>
              <button
                @click="closeModal"
                class="modal-close-button text-secondary-foreground text-xs sm:text-md px-4 py-2 m-2 rounded"
                @keyup.esc="closeModal"
                tabindex="0"
                aria-label="Close modal"
              >
                Close
              </button>
              <button
                class="bg-primary text-primary-foreground text-xs sm:text-md px-4 py-2 rounded"
                @click="buyNow(product)"
              >
                Buy
              </button>
            </div>

            <div v-if="reviews.length > 0" class="mt-6">
              <h3 class="font-semibold text-cyan-200">Customer Reviews</h3>
              <div v-for="(review, index) in reviews" :key="index" class="mt-2">
                From: {{ review.name || "Anonymous" }}
                <div class="flex justify-between p-2 border rounded-lg">
                  <div class="font-medium flex">
                    <div class="flex flex-wrap break-words max-w-xs">
                      {{ review.SW_Message }}
                    </div>
                  </div>
                  <div class="flex items-center ml-2">
                    <span
                      v-for="star in getStars(review.SW_Rating)"
                      :key="star"
                      class="text-yellow-500"
                    >
                      ★
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <h3 class="font-semibold text-cyan-200">Customer Reviews</h3>
              No Reviews Yet.
            </div>
          </div>
        </div>
      </div>
    </section>
    <section
      class="py-6 bg-gray-900 h-fit pt-12 sm:pt-0"
      v-if="products.length > 0"
    >
      <h1
        class="text-xl sm:text-3xl pt-24 font-bold flex justify-center text-white"
      >
        MORE PRODUCTS
      </h1>
      <div
        class="px-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 my-5"
      >
        <!-- <div v-for="(product, index) in products" :key="product.SW_Id" @click="openModal(product, index)"
                class="cursor-pointer">
                <img :src="getImageUrl(product.SW_Images)" :alt="product.SW_Name" class="w-full h-full aspect-square" />
                <p class="text-center text-white mt-2">{{ product.SW_Name }}</p>
            </div> -->
        <div
          class="rounded overflow-hidden shadow-lg flex flex-col cursor-pointer"
          v-for="(product, index) in products"
          :key="product.SW_Id"
          @click="openModal(product, index)"
        >
          <div class="relative w-full pb-[70%] overflow-hidden">
            <a
              ><img
                class="absolute top-0 left-0 w-full h-full object-cover"
                :src="getImageUrl(product.SW_Images)"
                :alt="product.SW_Name"
                loading="lazy" />
              <div
                class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"
              ></div></a
            ><a href="#!"
              ><div
                class="text-xs absolute top-0 right-0 bg-black px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-black transition duration-500 ease-in-out"
              >
                STREETWEAR
              </div></a
            >
          </div>
          <div class="px-6 py-4 mb-auto bg-gray-800 text-white">
            <a
              class="font-medium text-lg inline-block hover:text-[#D98757] transition duration-500 ease-in-out inline-block mb-2"
              >{{ product.SW_Name }}</a
            >
          </div>
          <div
            class="px-4 py-3 flex flex-row items-center justify-between bg-gray-100 bg-gray-800"
          >
            <a
              class="py-3 rounded-lg text-xs text-white font-regular mr-1 px-6 flex flex-row items-center cursor-pointer bg-gray-900 border"
              ><span class="ml-1">View Details</span></a
            >
          </div>
        </div>
      </div>
    </section>

    <div class="fixed md:relative flex justify-center items-center w-full">
      <p
        class="bg-gray-200 w-full py-4 flex text-lg font-black justify-center"
        v-if="products.length < 1"
      >
        No product available.
      </p>
    </div>

    <section
      v-if="checkoutModal"
      class="bg-gray-900 fixed left-0 top-0 w-full h-full flex items-center justify-center"
    >
      <div class="flex justify-center m-4">
        <div
          class="flex flex-col max-w-3xl p-6 space-y-4 sm:p-10 dark:bg-gray-50 dark:text-gray-800 rounded-md bg-white"
        >
          <h2 class="text-xl font-semibold">Check Out</h2>
          <ul class="flex flex-col divide-y dark:divide-gray-300">
            <li class="flex flex-col py-6 sm:flex-row sm:justify-between">
              <div class="flex w-full space-x-2 sm:space-x-4">
                <img
                  :src="getImageUrl(buyNowData[0].image)"
                  class="flex-shrink-0 object-cover w-20 h-20 dark:bg-gray-500 sm:w-32 sm:h-32 rounded"
                />

                <div class="flex flex-col justify-between w-full pb-4">
                  <div class="flex justify-between w-full pb-2 space-x-2">
                    <div class="space-y-1">
                      <h3
                        class="text-lg font-semibold leading-snug sm:pr-8"
                      ></h3>
                      <p class="text-sm dark:text-gray-600">Size:</p>
                      {{ buyNowData[0].size }}
                      <p class="text-sm dark:text-gray-600">Quantity:</p>
                      {{ buyNowData[0].quantity }}
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-semibold">₱</p>
                      {{ buyNowData[0].amount }}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="space-y-1 text-right">
            <p>
              Total amount:
              <span class="font-semibold">₱{{ buyNowData[0].amount }}</span>
            </p>
          </div>
          <div
            class="flex flex-col-reverse sm:flex-row justify-end sm:space-x-4"
          >
            <button
              @click="closeBuyNow"
              type="button"
              aria-label="Go back to cart"
              class="m-2 md:px-6 md:py-2 border rounded-md border-gray-800"
            >
              Back
            </button>
            <button
              type="button"
              aria-label="Place your order"
              @click="placeOrder"
              class="m-2 md:px-6 md:py-2 border rounded-md bg-gray-800 dark:text-gray-50 text-white border-gray-800"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </section>

    <nav class="fixed bottom-0 w-full bg-white md:hidden">
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
        <div
          @click="LogOut"
          class="group flex items-center py-4 cursor-pointer"
        >
          <LogOutIcon />
          <span
            class="z-50 absolute left-5/5 bottom-12 transform -translate-x-1/2 mt-2 text-white bg-gray-800 px-4 rounded-md hidden group-hover:flex"
          >
            Logout
          </span>
        </div>
      </ul>
    </nav>
    <FooterComponent />
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import BagIcon from "@/assets/icons/bag.vue";
import CogsIcon from "@/assets/icons/cogs.vue";
import HomeIcon from "@/assets/icons/home.vue";
import Cart from "@/assets/icons/cart.vue";
import LogOutIcon from "@/assets/icons/out.vue";
import { ref, computed, onMounted, watch } from "vue";
import axios, { backLink } from "../../../axios";
import HeaderComponent from "./HeaderComponent.vue";
import { useCartStore } from "../../stores/cart";
import FooterComponent from "./FooterComponent.vue";
import Magnify from "@/assets/icons/magnify.vue";
// import { useUserStore } from '@/stores/counter';

const closeIcon = ref(true);
const openSearch = ref(false);
const products = ref([]);
const currentIndex = ref(0);
const selectedProduct = ref(null);
const selectedQuantity = ref(1);
const selectedSize = ref(null);
const productSizes = ["S", "M", "L", "XL"];
const error = ref(null);
const checkoutModal = ref(false);
const mySize = ref("");
const searchInput = ref("");
const isToggleOpen = ref(false);
const cartStore = useCartStore(); // Pinia store
const cart = cartStore.cart; // Direct access if defined
const selectedProducts = ref([]);
const itemsPerPage = 2; // Adjust how many items per page you want
const currentPage = ref(1);
const paginatedImages = ref([]);

watch(
  () => products.value,
  (newProducts) => {
    newProducts.forEach((product, index) => {
      const imageArray = product.SW_Images.split(",");
      product.SW_Images = imageArray[0];

      paginatedImages.value = imageArray;
    });
  },
  { immediate: true }
);

const imagePerPage = 1;

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * imagePerPage;
  return paginatedImages.value.slice(start, start + imagePerPage);
});

const totalPages = computed(() =>
  Math.ceil(paginatedImages.value.length / imagePerPage)
);

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const formattedPrice = computed(() => {
  if (selectedProduct.value) {
    return `₱${(
      selectedProduct.value.SW_Price * selectedQuantity.value
    ).toFixed(2)}`;
  }
  return "₱0.00";
});

function getStars(rating) {
  return Array.from({ length: rating }, (_, index) => index < rating);
}

function toggleSearch() {
  openSearch.value = !openSearch.value;
  closeIcon.value = !closeIcon.value;
}

const canceledMinPrice = computed(() => {
  if (selectedProduct.value) {
    return `₱${(selectedProduct.value.SW_Price + 200 * 0.355).toFixed(2)}`;
  }
});

const canceledMaxPrice = computed(() => {
  if (selectedProduct.value) {
    return `₱${(selectedProduct.value.SW_Price + 600 * 0.355).toFixed(2)}`;
  }
});
const refactorImages = ref(null);
const getProducts = async () => {
  try {
    const response = await axios.get("/products");
    const allProducts = response.data.products;
    refactorImages.value = response.data.image;
    if (Array.isArray(allProducts)) {
      // Use '===' for comparison instead of '='
      const approvedProducts = allProducts.filter(
        (product) => product.SW_IsApproved === 1
      );
      products.value = approvedProducts;
    } else {
      console.warn("No products found in response");
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = "Failed to load products";
  }
};

const getProductsByCategory = async () => {
  try {
    products.value = [];
    let response;
    let allProducts = [];

    if (!searchInput.value) {
      response = await axios.get("/products");
      allProducts = response.data.products;
    } else {
      // Fetch products by category or name if search input has a value
      const queryParams = new URLSearchParams({
        category: searchInput.value,
        name: searchInput.value,
      });

      response = await axios.get(`/products/search?${queryParams}`);
      allProducts = response.data.renamedResult;
    }

    const approvedProducts = allProducts.filter(
      (product) => product.SW_IsApproved === 1
    );
    if (approvedProducts) {
      products.value = approvedProducts;
    } else {
      console.warn("No approved products found in response");
      products.value = []; // Clear the products list if none are approved
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = "Failed to load products. Please try again later.";
  }
};

const getImageUrl = (imagePath) => {
  return `${backLink}/images/${imagePath}`;
};

const userInfo = ref([]);

const fetchData = async () => {
  const id = localStorage.getItem("Id");
  try {
    const response = await axios.get(`/userinfo/${id}`);
    userInfo.value = response.data.response[0];
    localStorage.setItem(
      "location",
      `${userInfo.value.SW_Street}, ${userInfo.value.SW_City}, ${userInfo.value.SW_Province}`
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

onMounted(() => {
  // checkRealMessages();
  fetchData();
  getProducts();
  loadCart(); // Load cart data on mount
});

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % products.value.length;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + products.value.length) % products.value.length;
};
const buyNowData = ref([]);
const productIndex = ref("");
const reviews = ref([]);

const getReviews = async (id) => {
  try {
    const response = await axios.get(`/feedbacks/${id}`);
    reviews.value = response.data.renamedResult || null;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const openModal = (product, index) => {
  selectedProduct.value = product;

  getReviews(selectedProduct.value.SW_Size_id);

  buyNowData.value.push({
    uid: localStorage.getItem("Id"),
    pid: product.SW_Id,
    uname: localStorage.getItem("name"),
    image: product.SW_Images,
    pname: product.SW_Name,
    price: product.SW_Price,
    size: selectedSize.value,
    quantity: selectedQuantity.value,
    location: localStorage.getItem("location"),
    amount: parseFloat(product.SW_Price) * parseInt(selectedQuantity.value),
    psid: product.SW_Size_id,
  });

  productIndex.value = index;
  selectedQuantity.value = 1;
  selectedSize.value = null;

  setTimeout(() => {
    closeModal();
  }, 10000);
};

const buyNow = () => {
  checkoutModal.value = true;
};

const getSizes = (size) => {
  return size === "S" && products.value[productIndex.value].SW_Small === 0
    ? true
    : size === "M" && products.value[productIndex.value].SW_Medium === 0
    ? true
    : size === "L" && products.value[productIndex.value].SW_Large === 0
    ? true
    : size === "XL" && products.value[productIndex.value].SW_X_large === 0
    ? true
    : false;
};

const getQuantity = (qty) => {
  return mySize.value === "S" &&
    qty === products.value[productIndex.value].SW_Small
    ? true
    : mySize.value === "M" &&
      qty === products.value[productIndex.value].SW_Medium
    ? true
    : mySize.value === "L" &&
      qty === products.value[productIndex.value].SW_Large
    ? true
    : mySize.value === "XL" &&
      qty === products.value[productIndex.value].SW_X_large
    ? true
    : false;
};
const closeModal = () => {
  selectedProduct.value = null;
  selectedSize.value = null;
};

const increaseQuantity = () => {
  selectedQuantity.value += 1;
  buyNowData.value[0].quantity = selectedQuantity;
  buyNowData.value[0].amount =
    buyNowData.value[0].quantity * buyNowData.value[0].price;
};

const decreaseQuantity = () => {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value -= 1;
    buyNowData.value[0].amount =
      buyNowData.value[0].amount - buyNowData.value[0].price;
  }
};

const addOnCart = () => {
  if (selectedProduct.value && selectedSize.value) {
    try {
      cartStore.addToCart(
        selectedProduct.value,
        selectedQuantity.value,
        selectedSize.value
      );
      alert("Added to cart!");
      closeModal(); // Close the modal after adding
    } catch (error) {
      alert("Failed to add to cart. Please try again.");
      console.error(error);
    }
  } else {
    alert("Please select a size before adding to cart.");
  }
};

const placeOrder = async () => {
  try {
    const {
      data: { clientSecret },
    } = await axios.post("/api/create-payment-intent", {
      amount: buyNowData.value[0].amount,
      currency: "PHP",
    });

    const { data } = await axios.post("/api/paymongo-checkout", {
      clientSecret,
      items: buyNowData.value,
    });
    if (data.checkoutUrl) {
      // Redirect to the checkout URL
      window.location.href = data.checkoutUrl;
    } else {
      console.error("Checkout URL not found in response.");
      // Handle case when checkoutUrl is not present
    }
  } catch (error) {
    console.error("Error placing order:", error);
  }
};

const loadCart = () => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    try {
      cart.value = JSON.parse(storedCart);
    } catch (e) {
      console.error("Error parsing cart data:", e);
      cart.value = []; // Ensure cart is reset on error
    }
  }
};

const selectSize = (size) => {
  selectedQuantity.value = 1;
  mySize.value = size;
  selectedSize.value = size;
  buyNowData.value[0].size = size;
};

const LogOut = () => {
  localStorage.removeItem("isLog");
  window.location.reload();
};

const closeBuyNow = () => {
  checkoutModal.value = false;
  buyNowData.value[0].amount = buyNowData.value[0].price;
};

// Reactive State
const currentImageIndex = ref(0);

// Computed Property for the Current Group of Images
const currentImages = computed(() => {
  return (
    refactorImages.value[productIndex.value]?.map(
      (imageArray) => imageArray[0]
    ) || []
  );
});

// Methods
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const nextImage = () => {
  if (currentImageIndex.value < currentImages.value.length - 1) {
    currentImageIndex.value++;
  }
};
// const filteredReviews = ref([]);

// async function isRealWord(word) {
//     try {
//         const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
//         return response.ok;
//     } catch (error) {
//         console.error("Error checking word:", error);
//         return false;
//     }
// }

// async function checkRealMessages() {
//     filteredReviews.value = []; // Reset the filtered reviews

//     for (const review of reviews.value) {
//         const words = review.SW_Message.split(/\s+/);

//         let realWordCount = 0;
//         for (const word of words) {
//             if (await isRealWord(word)) {
//                 realWordCount++;
//             }
//             if (realWordCount >= 2) break;
//         }

//         if (realWordCount >= 2) {
//             filteredReviews.value.push(review);
//         }
//     }
// }
</script>













<style scoped>
.text-yellow-500 {
  color: #f59e0b;
}

.carousel-wrapper {
  display: flex;
  flex-direction: row;
}

.carousel-item {
  flex: none;
  width: 100%;
  box-sizing: border-box;
}

.carousel-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  /* Blue-500 */
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(31, 41, 55, 0.9);
}

.modal-content {
  background-color: #1f2937;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow: auto;
  position: relative;
}

.carousel-item img {
  width: 400px;
  height: 400px;
  object-fit: cover;
}

.modal-close-button {
  margin-left: 5rem;
  background-color: #ef4444;
  color: #ffffff;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-close-button:hover {
  background-color: #dc2626;
}

.modal-body {
  max-width: 24rem;
  margin: 0 auto;
}

.modal-image {
  width: 100%;
  height: 12rem;
  object-fit: cover;
  border-radius: 0.5rem;
}

.size-indicator {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background-color: #000000;
  color: #ffffff;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.bg-primary {
  background-color: #3b82f6;
  /* Blue-500 */
}

.bg-secondary {
  background-color: #4b5563;
  /* Gray-600 */
}

.text-primary-foreground {
  color: #ffffff;
}

.text-secondary-foreground {
  color: #e5e7eb;
  /* Gray-200 */
}

.text-muted-foreground {
  color: #9ca3af;
  /* Gray-400 */
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    /* Start from right */
    opacity: 0;
    /* Optional: starts invisible */
  }

  to {
    transform: translateX(0);
    /* End at original position */
    opacity: 1;
    /* Optional: becomes visible */
  }
}

.animate-in {
  animation: slide-in 0.5s ease forwards;
  /* Adjust duration and easing as necessary */
}
</style>
