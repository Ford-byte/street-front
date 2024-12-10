<template>
    <div>
        <!-- Loading State -->
        <div v-if="loading" class="text-center text-white py-4">Loading...</div>

        <!-- Error Handling -->
        <div v-if="error" class="text-center text-red-500 py-4">Error fetching products. Please try again.</div>

        <section v-else class="bg-gray-900 text-white py-12">
            <h2 class="text-3xl font-bold text-center mb-10">Latest Products</h2>
            <div class="relative overflow-hidden max-w-6xl mx-auto">
                <div class="carousel-wrapper flex transition-transform duration-700 ease-in-out"
                    :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
                    <div v-for="product in products" :key="product.SW_ID"
                        class="carousel-item bg-gray-800 p-6 rounded-lg shadow-lg text-center flex-none w-full md:w-1/3 mx-2 cursor-pointer transform hover:scale-105 transition-transform duration-300"
                        @click="openModal(product)">
                        <img :alt="product.SW_Name" :src="getImageUrl(product.SW_Images)"
                            class="mx-auto mb-4 rounded-lg border-2 border-gray-700" />
                        <h3 class="text-xl font-semibold mb-2">{{ product.SW_Name }}</h3>
                        <p class="text-gray-400 font-medium">{{ product.SW_Size }}</p>
                    </div>
                </div>

                <!-- Navigation Buttons -->
                <button @click="prevSlide"
                    class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button @click="nextSlide"
                    class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <!-- Product Details Modal -->
            <div v-if="selectedProduct"
                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 p-4">
                <div
                    class="relative bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
                    <!-- Close Button -->
                    <button @click="closeModal"
                        class="absolute top-2 right-2 p-2 text-white bg-red-600 rounded-full hover:bg-red-700 shadow-md focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- Modal Content -->
                    <div class="max-w-sm mx-auto bg-card rounded-lg shadow-lg p-4 relative">
                        <div class="relative">
                            <img :src="getImageUrl(selectedProduct.SW_Images)" :alt="selectedProduct.SW_Name"
                                class="w-full h-48 object-cover rounded-lg" />
                            <div v-if="selectedSize"
                                class="absolute bottom-2 right-2 bg-black text-white text-sm px-2 py-1 rounded">
                                Size: {{ selectedSize }}
                            </div>
                        </div>
                        <h2 class="text-2xl font-bold mt-2">{{ formattedPrice }}</h2>
                        <p class="line-through text-muted-foreground">{{ canceledMinPrice }} - {{ canceledMaxPrice }}</p>
                        <div class="mt-4">
                            <h3 class="font-semibold">Size</h3>
                            <div class="flex flex-wrap gap-2 mt-2">
                                <button v-for="size in productSizes" :key="size"
                                    :class="{ 'bg-primary': selectedSize === size, 'bg-secondary': selectedSize !== size }"
                                    class="text-secondary-foreground px-3 py-1 rounded" @click="selectSize(size)">
                                    {{ size }}
                                </button>
                            </div>
                        </div>
                        <div class="mt-4 flex items-center">
                            <h3 class="font-semibold">Quantity</h3>
                            <div class="flex items-center ml-4">
                                <button class="bg-secondary text-secondary-foreground px-2 py-1 rounded"
                                    @click="decreaseQuantity">-</button>
                                <span class="mx-2">{{ selectedQuantity }}</span>
                                <button class="bg-secondary text-secondary-foreground px-2 py-1 rounded"
                                    @click="increaseQuantity">+</button>
                            </div>
                        </div>
                        <div class="mt-6 flex justify-between">
                            <button
                                class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded"
                                @click="addToCart">Add to cart</button>
                            <button class="bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 rounded">Buy
                                now</button>
                        </div>

                        <!-- Reviews Section -->
                        <div v-if="selectedProduct.reviews && selectedProduct.reviews.length" class="mt-6">
                            <h3 class="font-semibold text-cyan-200">Customer Reviews</h3>
                            <div v-for="review in selectedProduct.reviews" :key="review.user" class="mt-2">
                                <p class="font-medium">{{ review.user }}:</p>
                                <p class="text-gray-400">{{ review.text }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '../../../frontend/axios';

const localHost = 'http://localhost:8080';
const products = ref([]);
const currentIndex = ref(0);
const selectedProduct = ref(null);
const selectedQuantity = ref(1);
const selectedSize = ref(null);
const productSizes = ['S', 'M', 'L', 'XL'];
const loading = ref(true);
const error = ref(null);

const defaultImg = "https://pixabay.com/images/search/question%20mark/";


const formattedPrice = computed(() => {
    if (selectedProduct.value) {
        return `₱${(selectedProduct.value.SW_Price * selectedQuantity.value).toFixed(2)}`;
    }
    return '₱0.00';
});

const canceledMinPrice = computed(() => {
    if (selectedProduct.value) {
        return `₱${(selectedProduct.value.SW_Price + (200*.355) ).toFixed(2)}`;
    }
});

const canceledMaxPrice = computed(() => {
    if (selectedProduct.value) {
        return `₱${(selectedProduct.value.SW_Price + (600*.355)).toFixed(2)}`;
    }
});




const getProducts = async () => {
    try {
        const response = await axios.get(`/products`);
        products.value = response.data.products;
    } catch (err) {
        console.error('Error fetching products:', err);
        error.value = 'Failed to load products';
    } finally {
        loading.value = false;
    }
};

const getImageUrl = (imagePath) => {
    const baseUrl = 'http://localhost:8080/images/';
    return `${baseUrl}${imagePath}`;
}

onMounted(() => {
    getProducts();
});

const nextSlide = () => {
    if (currentIndex.value < products.value.length - 1) {
        currentIndex.value += 1;
    } else {
        currentIndex.value = 0;
    }
};

const prevSlide = () => {
    if (currentIndex.value > 0) {
        currentIndex.value -= 1;
    } else {
        currentIndex.value = products.value.length - 1;
    }
};

const openModal = (product) => {
    selectedProduct.value = product;
    selectedQuantity.value = 1;
    selectedSize.value = null;
};

const closeModal = () => {
    selectedProduct.value = null;
    selectedSize.value = null;
};

const increaseQuantity = () => {
    selectedQuantity.value += 1;
};

const decreaseQuantity = () => {
    if (selectedQuantity.value > 1) {
        selectedQuantity.value -= 1;
    }
};

const addToCart = () => {
    alert('Added to cart!');
};

const selectSize = (size) => {
    selectedSize.value = size;
};
</script>

<style scoped>
.carousel-wrapper {
    display: flex;
    flex-direction: row;
}

.carousel-item {
    flex: none;
    width: 100%;
    box-sizing: border-box;
}

.bg-card {
    background-color: #1f2937;
    /* Gray-800 */
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
</style>
