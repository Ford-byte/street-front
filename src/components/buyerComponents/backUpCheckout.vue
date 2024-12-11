<template>
  <div>
    <HeaderComponent />
    <section class="h-screen bg-gray-900">
      <div class="flex justify-center m-4">
        <div
          class="flex flex-col max-w-3xl p-6 space-y-4 sm:p-10 dark:bg-gray-50 dark:text-gray-800 rounded-md bg-white">
          <h2 class="text-xl font-semibold">Check Out</h2>
          <ul class="flex flex-col divide-y dark:divide-gray-300">
            <li v-for="(item, index) in checkedItems" :key="index"
              class="flex flex-col py-6 sm:flex-row sm:justify-between">
              <div class="flex w-full space-x-2 sm:space-x-4">
                <img class="flex-shrink-0 object-cover w-20 h-20 dark:bg-gray-500 sm:w-32 sm:h-32 rounded"
                  :src="getImageUrl(item.product.SW_Images)" :alt="item.product.SW_Name" />
                <div class="flex flex-col justify-between w-full pb-4">
                  <div class="flex justify-between w-full pb-2 space-x-2">
                    <div class="space-y-1">
                      <h3 class="text-lg font-semibold leading-snug sm:pr-8">
                        {{ item.product.SW_Name }}
                      </h3>
                      <p class="text-sm dark:text-gray-600">
                        Size: {{ item.size }}
                      </p>
                      <p class="text-sm dark:text-gray-600">
                        Quantity: {{ item.quantity }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-semibold">
                        ₱{{
                          (item.product.SW_Price * item.quantity - ((item.product.SW_Price *
                            item.quantity) * (item.product.SW_Discount / 100))).toFixed(2)
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="flex w-full justify-end">
            <label for="payment-method" class="mr-2 font-semibold">Payment Method:</label>
            <select name="payment-method" id="payment-method" v-model="paymentMethod">
              <option value="cod">Cash on Delivery</option>
              <option value="gcash">Gcash</option>
            </select>
          </div>
          <div class="space-y-1 text-right">
            <p>
              Total amount:
              <span class="font-semibold">₱{{ calculateTotal() }}</span>
            </p>
          </div>
          <div class="flex flex-col-reverse sm:flex-row justify-end sm:space-x-4">
            <button type="button" @click="router.push('/cart')" aria-label="Go back to cart"
              class="m-2 md:px-6 md:py-2 border rounded-md border-gray-800">
              Back
            </button>
            <button type="button" @click="placeOrder" aria-label="Place your order"
              class="m-2 md:px-6 md:py-2 border rounded-md bg-gray-800 dark:text-gray-50 text-white border-gray-800">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useCartStore } from "@/stores/cart";
import router from "@/router";
import HeaderComponent from "./HeaderComponent.vue";
import { computed, onMounted, ref } from "vue";
import axios, { backLink } from "../../../axios";

const cartStore = useCartStore();
const paymentMethod = ref("cod");

const getImageUrl = (imagePath) => `${backLink}/images/${imagePath}`;

const checkedItems = computed(() => {
  return cartStore.cart.filter((item) => item.selected);
});

const calculateTotal = () => {
  return checkedItems.value
    .reduce((total, item) => {
      return total + (item.product.SW_Price * item.quantity - ((item.product.SW_Price * item.quantity) * (item.product.SW_Discount / 100)));
    }, 0)
    .toFixed(2);
};

const orders = ref([]);
const ordersToPlace = ref([]);
const placeOrder = async () => {
  if (checkedItems.value.length === 0) {
    return showNotification("No items selected to place an order.");
  }

  if (!confirm("Are you sure you want to place the order?")) return;

  ordersToPlace.value = checkedItems.value.map((item) => ({
    uid: localStorage.getItem("Id"),
    pid: item.product.SW_Size_id,
    uname: localStorage.getItem("name"),
    pname: item.product.SW_Name,
    price: item.product.SW_Price - parseInt(parseFloat(item.product.SW_Price) * item.product.SW_Discount / 100),
    size: item.size,
    quantity: item.quantity,
    location: localStorage.getItem("location"),
    amount: (parseFloat(item.product.SW_Price) * parseInt(item.quantity) - parseInt((parseFloat(item.product.SW_Price) * parseInt(item.quantity)) * item.product.SW_Discount / 100)),
    psid: item.product.SW_Size_id,
    productId: JSON.parse(localStorage.getItem("cart"))[0].product.SW_Id,
  }));

  let paymentSuccess = false;

  if (paymentMethod.value === "gcash") {
    paymentSuccess = await handleGcashPayment(calculateTotal());
    confirmRemoveFromCart(ordersToPlace.value[0]);
  } else if (paymentMethod.value === "cod") {
    for (const [index, order] of ordersToPlace.value.entries()) {
      paymentSuccess = (await handleCashOnDelivery(order)) || paymentSuccess;
      confirmRemoveFromCart(ordersToPlace.value[index]);
    }

  }

  if (paymentSuccess) {
    const updatedCart = cartStore.cart.filter((item) => !item.selected);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    showNotification("Order placed successfully!");
    orders.value = []; // Clear orders after successful placement
    router.push("/confirmation"); // Redirect to a confirmation page
  }
};

const handleGcashPayment = async (amount) => {
  try {
    const {
      data: { clientSecret },
    } = await axios.post("/api/create-payment-intent", {
      amount: amount,
      currency: "PHP",
    });

    const { data } = await axios.post("/api/paymongo-checkout", {
      clientSecret,
      items: ordersToPlace.value,
    });

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      console.error("Checkout URL not found in response.");
    }
  } catch (error) {
    console.error("Error placing order:", error);
  }
};

const handleCashOnDelivery = async (orderDetails) => {
  try {
    await axios.post("/orders/cod", orderDetails);
    return true;
  } catch (error) {
    console.error("Error during Cash on Delivery:", error);
    showNotification("Failed to place order. Please try again.");
  }
  return false;
};

const showNotification = (message) => {
  alert(message); // Replace with a proper notification system if needed
};

const confirmRemoveFromCart = (item) => {
  cartStore.removeFromCart(item.productId, item.size); // Pass the appropriate id for removal
};

// onMounted(()=>{
//     console.log(JSON.parse(localStorage.getItem("cart"))[0].product.SW_Id);
// })
</script>