<template>
    <div>
        <HeaderComponent />
        <RouterView />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import HeaderComponent from './buyerComponents/HeaderComponent.vue';
import { onMounted, onUnmounted, ref } from 'vue';

const onStorageChange = (event) => {
    const keysToMonitor = ['role', 'isLog', 'isUser', 'Id','name'];
    if (keysToMonitor.includes(event.key)) {
        keysToMonitor.forEach(key => localStorage.removeItem(key));
        window.location.reload();
        router.push('/');
    }
};
onMounted(() => {
    window.addEventListener('storage', onStorageChange);
});

onUnmounted(() => {
    window.removeEventListener('storage', onStorageChange);
});
</script>

<style lang="scss" scoped></style>