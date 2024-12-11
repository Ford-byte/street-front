<template>
    <div>
        <HeaderComponent />
        <section class="h-full flex items-center justify-center bg-gray-900">
            <div class="flex justify-center m-4 w-2/3">
                <div class="flex flex-col w-full p-6 space-y-4 sm:p-10 bg-white dark:text-gray-800 rounded-md">
                    <h2 class="text-xl font-semibold">Your cart</h2>
                    <ul class="flex flex-col bg-white ">
                        <li v-for="item in cartStore.cart" :key="item.product.SW_Id"
                            class="flex flex-col py-6 sm:flex-row sm:justify-between">
                            <div class="flex w-full space-x-2 sm:space-x-4">
                                <img class="flex-shrink-0 object-cover w-auto    h-28 dark:bg-gray-500 sm:w-32 sm:h-32 rounded"
                                    :src="getImageUrl(item.product.SW_Images)" :alt="item.product.SW_Name" />
                                <div class="flex flex-col justify-between w-full pb-4">
                                    <div class="flex justify-between w-full pb-2 space-x-2">
                                        <div class="space-y-1">
                                            <h3 class="text-lg font-semibold leading-snug sm:pr-8">{{
                                                item.product.SW_Name
                                                }}
                                            </h3>
                                            <p class="text-sm dark:text-gray-600">Size: {{ item.size }}</p>
                                            <p class="text-sm dark:text-gray-600">Quantity: {{ item.quantity }}</p>
                                        </div>
                                        <div class="text-right flex  gap-2">
                                            <p class="text-lg font-semibold">₱{{ (item.product.SW_Price *
                                                item.quantity).toFixed(2) - ((item.product.SW_Price *
                                                    item.quantity) * (item.product.SW_Discount / 100)) }}.00</p>
                                            <p class="flex line-through">{{ item.product.SW_Price *
                                                item.quantity.toFixed(2) }}.00</p>
                                        </div>
                                    </div>
                                    <div class="flex text-sm divide-x">
                                        <button type="button" class="flex items-center px-2 py-1 pl-0 space-x-1"
                                            @click="removeFromCart(item)">
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center mt-2">
                                <input type="checkbox" v-model="item.selected" />
                                <label class="ml-2 text-sm">Select this item</label>
                            </div>
                        </li>
                    </ul>
                    <div class="space-y-1 text-right">
                        <p>Total amount: <span class="font-semibold">₱{{ calculateTotal() }}</span></p>
                        <p class="text-sm dark:text-gray-600">Not including taxes and shipping costs</p>
                    </div>
                    <div class="flex flex-col-reverse sm:flex-row justify-end sm:space-x-4">
                        <button type="button" @click="router.push('/buyerHomepage')"
                            class="m-2 md:px-6 md:py-2 border rounded-md border-gray-800">Back</button>
                        <button type="button" @click="continueToCheckout"
                            class="m-2 md:px-6 md:py-2 border rounded-md bg-gray-800 dark:text-gray-50 text-white border-gray-800">Continue
                            to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <FooterComponent />
    </div>
</template>


<script setup>
import { useCartStore } from '@/stores/cart';
import router from '@/router';
import HeaderComponent from './HeaderComponent.vue';
import FooterComponent from "../buyerComponents/FooterComponent.vue";

import { backLink } from '../../../axios';

const cartStore = useCartStore();

const getImageUrl = (imagePath) => `${backLink}/images/${imagePath}`;

const calculateTotal = () => {
    return cartStore.cart.reduce((total, item) => {
        return item.selected ? total + ((item.product.SW_Price * item.quantity) - ((item.product.SW_Price * item.quantity)*(item.product.SW_Discount/100) ) ) : total;
    }, 0).toFixed(2);
};

const removeFromCart = (item) => {
    if (!item.selected) {
        alert("Please select the item before removing.");
        return;
    }

    if (confirm(`Are you sure you want to remove ${item.product.SW_Name} from your cart?`)) {
        cartStore.removeFromCart(item.product.SW_Id, item.size);
    }
};

const continueToCheckout = () => {
    const selectedItems = cartStore.cart.filter(item => item.selected);
    if (selectedItems.length === 0) {
        alert("Please select at least one item to proceed to checkout.");
        return;
    }
    router.push('/checkout');
};
</script>
