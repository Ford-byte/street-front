<template>
    <div v-if="product" class="modal-overlay">
        <div class="modal-content">
            <button @click="$emit('close')" class="modal-close-button" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="modal-body">
                <img :src="getImageUrl(product.SW_Images)" :alt="product.SW_Name" class="modal-image" />
                <div class="modal-details">
                    <h2 class="text-2xl font-bold mt-2">{{ formattedPrice }}</h2>
                    <p v-if="canceledMinPrice && canceledMaxPrice" class="line-through text-gray-400">
                        {{ canceledMinPrice }} - {{ canceledMaxPrice }}
                    </p>
                    
                    <SizeSelector
                        :productSizes="productSizes"
                        :selectedSize="selectedSize"
                        @select-size="$emit('select-size', $event)"
                    />
                    
                    <QuantitySelector
                        :selectedQuantity="selectedQuantity"
                        @increase="$emit('increase-quantity')"
                        @decrease="$emit('decrease-quantity')"
                    />
                    
                    <div class="action-buttons mt-6 flex justify-between">
                        <button class="bg-secondary text-white hover:bg-secondary-dark px-4 py-2 rounded" @click="$emit('add-to-cart')">Add to cart</button>
                        <button class="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded">Buy now</button>
                    </div>
                    
                    <ReviewSection v-if="product.reviews && product.reviews.length" :reviews="product.reviews" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['product', 'selectedQuantity', 'selectedSize', 'canceledMinPrice', 'canceledMaxPrice', 'productSizes']);
const getImageUrl = (imagePath) => `http://localhost:8080/images/${imagePath}`;
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(31, 41, 55, 0.9); /* Gray-900 with opacity */
    padding: 1rem;
}

.modal-content {
    background-color: #1f2937; /* Gray-800 */
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 32rem;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.modal-close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: transparent;
    color: #ef4444; /* Red-500 */
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
}

.modal-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 0.5rem;
}

.modal-details {
    padding: 1rem 0;
}

.action-buttons button {
    transition: background-color 0.3s;
}

.bg-secondary {
    background-color: #4b5563; /* Gray-600 */
}

.bg-secondary-dark {
    background-color: #374151; /* Gray-700 */
}

.bg-primary {
    background-color: #3b82f6; /* Blue-500 */
}

.bg-primary-dark {
    background-color: #2563eb; /* Blue-600 */
}
</style>
