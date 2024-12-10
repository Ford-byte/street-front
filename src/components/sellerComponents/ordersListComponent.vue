<template>
  <div>
    <!-- <div class="container mx-auto p-4 sm:mt-12 absolute bottom-12 sm:relative md:relative"> -->
    <div
      class="container flex justify-center flex-col h-full md:block mx-auto p-4 sm:mt-12 absolute bottom-12 sm:relative md:relative"
    >
      <!-- Header and Order Counter -->
      <div
        class="flex flex-col md:flex-row md:justify-between items-center mb-4"
      >
        <h1 class="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
          Order List
        </h1>
        <div class="mb-4 md:mb-0">
          <div
            class="flex overflow-hidden rounded-lg dark:bg-gray-50 dark:text-gray-800 w-full m-4"
          >
            <div
              class="flex items-center justify-center px-4 dark:bg-gray-600 dark:text-gray-100"
            >
              <Bag />
            </div>
            <div class="flex items-center justify-between flex-1 p-3">
              <p class="text-2xl font-semibold">{{ orderCount }}</p>
              <p>Orders</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="text-red-600 mt-4">
        {{ errorMessage }}
      </div>

      <!-- Orders Table -->
      <div class="overflow-x-auto max-h-[420px] overflow-y-auto">
        <table
          class="bg-white border min-w-full border-gray-200 rounded-lg shadow-md"
        >
          <thead>
            <tr class="bg-gray-100 border-b">
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Name
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Size
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Quantity
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Total
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Order Date
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Status
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Action
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Messages
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedOrders.length === 0">
              <td colspan="7" class="py-3 px-4 text-gray-600 text-center">
                No orders found.
              </td>
            </tr>
            <tr
              v-for="order in paginatedOrders"
              :key="order.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="py-3 px-4 text-gray-800">{{ order.SW_Uname }}</td>
              <td class="py-3 px-4 text-gray-600">{{ order.SW_Size }}</td>
              <td class="py-3 px-4 text-gray-600">{{ order.SW_Quantity }}</td>
              <td class="py-3 px-4 text-gray-600">{{ order.SW_Price }}</td>
              <td class="py-3 px-4 text-gray-600">
                {{ timeControl(order.SW_IsCreated) }}
              </td>
              <td class="py-3 px-4 text-gray-600">
                <div
                  class="flex items-center p-2 rounded-md cursor-pointer"
                  @click="confirmApproval(order)"
                >
                  <!-- <i v-if="order.SW_IsApproved === 1" class="fas fa-check-circle text-green-600 mr-2"></i>
                                <i v-else class="fas fa-times-circle text-red-600 mr-2"></i> -->
                  <Check
                    v-if="order.SW_IsApproved === 1"
                    class="text-green-500 mr-2"
                  />
                  <Wrong v-else class="text-red-600 mr-2" />
                </div>
              </td>
              <td class="py-3 px-4">
                <button
                  @click="openModal(order)"
                  class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 m-1"
                >
                  View Details
                </button>
                <button
                  @click="confirmDelete(order.SW_Id)"
                  class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 m-1"
                >
                  Delete
                </button>
              </td>
              <td class="py-3 px-4 text-gray-600 hover:text-purple-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  @click="showUsersRequest(order)"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div
        class="flex flex-row md:flex-row justify-between items-center mt-4 mb-24"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span class="mt-2 md:mt-0"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      <!-- View Details Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h2 class="text-xl font-semibold mb-4">Order Details</h2>
          <p><strong>Customer Name:</strong> {{ currentOrder.SW_Uname }}</p>
          <p>
            <strong>Order Date:</strong>
            {{ timeControl(currentOrder.SW_IsCreated) }}
          </p>
          <p><strong>Total Amount:</strong> {{ currentOrder.SW_Price }}</p>
          <p><strong>Location:</strong> {{ currentOrder.SW_Location }}</p>
          <p>
            <strong>Status:</strong>
            {{ currentOrder.SW_IsApproved ? "Approved" : "Disapproved" }}
          </p>
          <div class="flex justify-end">
            <button
              @click="closeModal"
              type="button"
              class="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation Modals -->
      <ConfirmationModal
        :visible="isDeleteModalOpen"
        title="Confirm Deletion"
        message="Are you sure you want to delete this order?"
        @confirm="deleteOrder(orderIdToDelete)"
        @cancel="closeDeleteModal"
      />

      <ConfirmationModal
        :visible="isApprovedModalOpen"
        title="Confirm Approval"
        message="Are you sure you want to change the approval status of this order?"
        @confirm="approvedOrder(orderIdToApprove)"
        @cancel="closeApprovedModal"
      />

      <SuccessModal
        :visible="isSuccessModalVisible"
        :message="successMessage"
        @close="isSuccessModalVisible = false"
      />

      <ErrorModal
        :visible="isErrorModalVisible"
        :message="errorMessage"
        @close="isErrorModalVisible = false"
      />
    </div>
     <ChatComponent />
  </div>
</template>

<script setup>
import axios from "../../../axios";
import { ref, computed, onMounted } from "vue";
import ErrorModal from "../services/ErrorModal.vue";
import SuccessModal from "../services/SuccessModal.vue";
import ConfirmationModal from "../services/ConfirmationModal.vue";
import Bag from "@/assets/icons/bag.vue";
import Check from "@/assets/icons/check.vue";
import Wrong from "@/assets/icons/wrong.vue";
import ChatComponent from "../../components/ChatComponent.vue";

const orders = ref([]);
const isModalOpen = ref(false);
const currentOrder = ref({});
const currentPage = ref(1);
const perPage = ref(4);
const errorMessage = ref("");
const isDeleteModalOpen = ref(false);
const isApprovedModalOpen = ref(false);
const orderIdToDelete = ref(null);
const orderIdToApprove = ref(null);
const isSuccessModalVisible = ref(false);
const successMessage = ref("");
const isErrorModalVisible =ref(false);

const showUsersRequest = (orders) => {
  localStorage.setItem("buyer_id", orders.SW_Uid);
  localStorage.setItem("buyer_fullname", orders.SW_Uname);
  localStorage.setItem("buyer_statusMode", "online");
  location.reload();
};
// Fetch orders
const fetchOrders = async () => {
  try {
    const response = await axios.get("/orders");
    // console.log(response.data.response[0].SW_IsCostumerDeleted);
    // if(response.data.response.SW_IsCostumerDeleted == 0){

    response.data.response.forEach((element, index) => {
      if (response.data.response[index].SW_IsCostumerDeleted === 0) {
        orders.value.push(element);
      }
    });

    errorMessage.value = "";
  } catch (error) {
    orders.value = []; // Reset orders if fetching fails
    errorMessage.value = "Error fetching orders. Please try again later.";
    console.error("Error fetching orders:", error);
  }
};

function timeControl(isoDateString) {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Computed properties
const orderCount = computed(() => orders.value.length);
const totalPages = computed(() =>
  Math.ceil(orders.value.length / perPage.value)
);
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return orders.value.slice(start, start + perPage.value);
});

// Modal control
const openModal = (order) => {
  currentOrder.value = { ...order };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  currentOrder.value = {};
};

const confirmDelete = (orderId) => {
  orderIdToDelete.value = orderId;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  orderIdToDelete.value = null;
};

const confirmApproval = (order) => {
  orderIdToApprove.value = order.SW_Id;
  isApprovedModalOpen.value = true;
};

const closeApprovedModal = () => {
  isApprovedModalOpen.value = false;
  orderIdToApprove.value = null;
};

// Delete order
const deleteOrder = async (orderId) => {
  try {
    await axios.delete(`/order/${orderId}`);
    orders.value = orders.value.filter((order) => order.id !== orderId);
    successMessage.value = "Order deleted successfully!";
    isSuccessModalVisible.value = true;
    window.location.reload();
    closeDeleteModal();
  } catch (error) {
    errorMessage.value = "Failed to delete order. Please try again.";
    console.error("Error deleting order:", error);
  }
};

// Update order approval
const approvedOrder = async () => {
  try {
    await axios.put(`/order/${orderIdToApprove.value}`);
    successMessage.value = "Order approval status updated!";
    isSuccessModalVisible.value = true;
    closeApprovedModal();
    setTimeout(() => {
      isSuccessModalVisible.value = false;
    }, 1000);
    window.location.reload();
  } catch (error) {
    errorMessage.value = "Failed to update order approval. Please try again.";
    console.error("Error updating order approval:", error);
  }
};

// Pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Lifecycle hook
onMounted(() => {
  fetchOrders();
});
</script>
