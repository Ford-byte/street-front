<template>
    <div>
        <button @click="logout">LOG OUT</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

router = useRouter();

const logout = () => {
    localStorage.setItem('isLog','');
}
</script>