<template>
    <section class="py-6 bg-gray-900">
        <div class="container grid grid-cols-2 gap-4 p-4 mx-auto md:grid-cols-4">
            <div 
                v-for="product in products" 
                :key="product.SW_Id" 
                @click="$emit('open-modal', product)" 
                class="cursor-pointer transition-transform hover:scale-105"
            >
                <img 
                    :src="getImageUrl(product.SW_Images)" 
                    :alt="product.SW_Name" 
                    class="w-full h-full rounded shadow-sm min-h-48 object-cover"
                />
            </div>
        </div>
    </section>
</template>

<script setup>
const props = defineProps(['products']);

// Helper function to construct the image URL
const getImageUrl = (imagePath) => `http://localhost:8080/images/${imagePath}`;
</script>

<style scoped>
/* You can add relevant styles here for hover effects or responsive design */
</style>
