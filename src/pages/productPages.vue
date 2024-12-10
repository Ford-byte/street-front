<template>
    <div>
        <HeaderComponent />

        <FooterComponent/>
    </div>
</template>

<script setup>
import FooterComponent from '@/components/buyerComponents/FooterComponent.vue';
import HeaderComponent from '@/components/buyerComponents/HeaderComponent.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id; // Assuming the URL has a dynamic route like `/your-route/:id`
</script>