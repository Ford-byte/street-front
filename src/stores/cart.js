import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const cart = ref([]);

    const loadCart = () => {
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (Array.isArray(storedCart)) {
            cart.value = storedCart;
        }
    };

    loadCart();

    watch(cart, (newCart) => {
        localStorage.setItem('cart', JSON.stringify(newCart));
    }, { deep: true });

    function addToCart(product, quantity, size) {
        if (quantity < 1 || !product || !size) return; // Prevent invalid additions
        const existingItem = cart.value.find(item => item.product.SW_Id === product.SW_Id && item.size === size);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.value.push({ product, quantity, size });
        }
    }

    function removeFromCart(productId, size) {
        cart.value = cart.value.filter(item => !(item.product.SW_Id === productId && item.size === size));
    }

    function clearCart() {  
        cart.value = [];
    }

    function calculateTotal() {
        return cart.value.reduce((total, item) => total + (item.product.SW_Price * item.quantity), 0).toFixed(2);
    }

    function getTotalItems() {
        return cart.value.reduce((total, item) => total + item.quantity, 0);
    }

    return { cart, addToCart, removeFromCart, clearCart, calculateTotal, getTotalItems };
});
