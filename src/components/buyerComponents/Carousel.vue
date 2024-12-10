<template>
    <div class="relative overflow-hidden">
        <div class="carousel-wrapper flex transition-transform duration-700 ease-in-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div v-for="product in products" :key="product.SW_Id"
                class="carousel-item bg-gray-800 p-6 rounded-lg shadow-lg text-center flex-none w-full cursor-pointer transform hover:scale-105 transition-transform duration-300"
                @click="$emit('open-modal', product)">
                <img :alt="product.SW_Name" :src="getImageUrl(product.SW_Images)"
                    class="mx-auto mb-4 rounded-lg border-2 border-gray-700" />
                <h3 class="text-xl font-semibold mb-2">{{ product.SW_Name }}</h3>
                <p class="text-gray-400 font-medium">{{ product.SW_Size }}</p>
            </div>
        </div>
        <button @click="prevSlide" class="carousel-nav-button left-4" :disabled="currentIndex === 0">
            <span class="material-icons">chevron_left</span>
        </button>
        <button @click="nextSlide" class="carousel-nav-button right-4" :disabled="currentIndex === products.length - 1">
            <span class="material-icons">chevron_right</span>
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['products']);
const currentIndex = ref(0);

const nextSlide = () => {
    if (currentIndex.value < props.products.length - 1) {
        currentIndex.value++;
    }
};

const prevSlide = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};

const getImageUrl = (imagePath) => {
    return `http://localhost:8080/images/${imagePath}`;
};
</script>

<style scoped>
.carousel-wrapper {
    display: flex;
    position: relative;
    width: 100%; /* Ensure the wrapper takes full width */
    overflow: hidden; /* Hide overflow to show one item at a time */
}

.carousel-item {
    flex: 0 0 100%; /* Each item takes full width */
    transition: transform 0.3s ease;
}

.carousel-nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(31, 41, 55, 0.7); /* Semi-transparent background */
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s;
}

.carousel-nav-button:hover {
    background-color: rgba(31, 41, 55, 0.9); /* Darker on hover */
}

.carousel-nav-button:disabled {
    cursor: not-allowed;
    opacity: 0.5; /* Makes the button look inactive */
}

.left-4 {
    left: 1rem;
}

.right-4 {
    right: 1rem;
}

.material-icons {
    font-size: 24px;
}
</style>
