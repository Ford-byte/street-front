  <template>
  <div>
    <HeaderComponent />
    
    <div
      class="bg-gray-900 fixed inset-0 overflow-auto flex justify-center items-center md:items-baseline"
    >
      <div class="bg-gray-900 md:mt-24 w-full overflow-y-auto max-w-2xl">
        <h1 class="text-2xl md:text-5xl flex justify-center py-4 bg-white">
          My Orders
        </h1>
        <table class="bg-gray-800 border border-gray-700 w-full">
          <thead>
            <tr class="text-white text-sm">
              <th class="py-2 px-2 hidden sm:table-cell">No.</th>
              <th class="py-2 px-2">Product Name</th>
              <th class="py-2 px-2">Size</th>
              <th class="py-2 px-2">Quantity</th>
              <th class="py-2 px-2">Total</th>
              <th class="py-5 px-2 flex justify-center h-full">Status</th>
            </tr>
          </thead>
          <tbody class="text-white text-sm">
            <tr
              v-for="(order, index) in orders"
              :key="order.SW_Id"
              class="border border-white"
            >
              <td class="py-2 px-2 text-center hidden sm:table-cell">
                {{ index + 1 }}
              </td>
              <td class="py-2 px-2">{{ order.SW_Pname }}</td>
              <td class="py-2 px-2">{{ order.SW_Size }}</td>
              <td class="py-2 px-2">{{ order.SW_Quantity }}</td>
              <td class="py-2 px-2">{{ order.SW_Price }}</td>
              <td
                class="py-2 px-2 flex flex-col sm:flex-row justify-center items-center gap-2"
              >
                <button
                  :class="[
                    order.SW_IsApproved && order.SW_Status
                      ? 'text-green-600'
                      : order.SW_IsApproved
                      ? order.SW_Status
                        ? 'text-green-600'
                        : 'text-yellow-400'
                      : 'text-red-500',
                    'rounded-md w-full sm:w-auto text-center text-xs',
                  ]"
                  :disabled="!order.SW_IsApproved || order.SW_Status"
                  aria-label="Approval status"
                  @click="
                    order.SW_IsApproved && !order.SW_Status
                      ? openOrderReceivedModal(order)
                      : null
                  "
                >
                  {{
                    order.SW_IsDeleted && !order.SW_IsApproved
                      ? "Declined"
                      : order.SW_IsApproved
                      ? order.SW_Status
                        ? "Complete"
                        : "Pending"
                      : "Waiting for Approval"
                  }}
                </button>

                <button
                  v-if="!order.SW_IsDeleted || !order.SW_IsApproved"
                  class="text-orange-500 text-xs rounded-md w-full sm:w-auto"
                  @click="openCancelModal(order)"
                >
                  Cancel
                </button>

                <button
                  class="text-xs rounded-md w-full sm:w-auto p-2 text-red-500"
                  @click="openDeleteModal(order)"
                  :disabled="!order.SW_Status || !order.SW_IsApproved"
                  :class="order.SW_Status ? 'block' : 'hidden'"
                >
                  Delete
                </button>

                <button
                  class="text-xs text-blue-500 hover:underline hover:text-blue-700"
                  @click="selectedItem(order)"
                >
                  View
                </button>
                <!-- <button
                  class="text-orange-500 text-xs rounded-md w-full sm:w-auto"
                  @click="chatModalShow(order)"
                >
                  Chat
                </button> -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                @click="chatModalShow(order)"
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

        <div v-if="orders.length === 0" class="text-center bg-white p-4">
          No orders available.
        </div>
        <div v-if="loading" class="mt-4 text-center">Loading orders...</div>
      </div>
    </div>

    <section
      id="detailModal"
      v-if="isDetailsOpen"
      class="fixed top-0 left-0 w-full h-full flex justify-center items-center"
    >
      <span
        class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 opacity-50"
        @click="isDetailsOpen = !isDetailsOpen"
      ></span>
      <div class="border p-6 bg-white text-black rounded-lg shadow-lg z-10">
        <div class="w-full justify-between flex">
          <h2 class="text-lg font-semibold mb-2">Order Details</h2>
          <Info
            class="text-red-500 hover:text-red-700 hover:cursor-pointer"
            :disabled="selectedOrder.SW_Status"
            @click="handleReport"
          />
        </div>
        <p><strong>Product Name:</strong> {{ selectedOrder.SW_Pname }}</p>
        <p>
          <strong>Size:</strong>
          {{
            selectedOrder.SW_Size == "S"
              ? "Small"
              : selectedOrder.SW_Size == "M"
              ? "Medium"
              : selectedOrder.SW_Size == "L"
              ? "Large"
              : "Extra Large"
          }}
        </p>
        <p><strong>Quantity:</strong> {{ selectedOrder.SW_Quantity }}</p>
        <p><strong>Total Price:</strong> {{ selectedOrder.SW_Price }}</p>
        <p>
          <strong>Status:</strong>
          {{ !selectedOrder.SW_Status ? "Waiting for Approval" : "Approved" }}
        </p>
        <p>
          <strong>Date Ordered:</strong>
          {{ timeControl(selectedOrder.SW_IsCreated) }}
        </p>

        <div class="mt-4 flex justify-end">
          <button
            class="bg-red-600 text-white rounded-md px-4 py-2 mr-2"
            @click="isDetailsOpen = !isDetailsOpen"
          >
            Close
          </button>
          <button
            v-if="
              selectedOrder.SW_Status !== 'Complete' &&
              !selectedOrder.SW_IsApproved
            "
            class="bg-yellow-500 text-white rounded-md px-4 py-2"
            @click="openCancelModal(selectedOrder)"
          >
            Cancel Order
          </button>
        </div>
      </div>

      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        @click="closeDetailModal()"
        aria-label="Close modal"
      >
        &times;
      </button>
    </section>

    <!-- Report Modal -->
    <section v-if="isReportOpen" id="reportSection">
      <span class="fixed flex justify-center items-center"></span>
      <span
        class="fixed top-0 left-0 w-full h-full bg-black opacity-50"
        @click="isReportOpen = false"
      ></span>
      <div class="py-4 bg-white w-full h-3/4 fixed bottom-0 overflow-y-scroll">
        <div class="container flex flex-col gap-y-2">
          <div class="flex items-center gap-4">
            <h2>Report this</h2>
            <div>
              <select
                name="reportType"
                class="border border-gray-300 rounded-md p-2"
                v-model="reportedPersona"
              >
                <option :value="reportedPersona" class="mx-4">
                  {{ reportedPersona }}
                </option>
                <option value="seller">Seller</option>
              </select>
            </div>
          </div>
          <input type="file" multiple @change="handleFileChange" class="mb-4" />
          <div class="imageGrid grid grid-cols-3 gap-2">
            <div
              v-for="(image, index) in previewURLs"
              :key="index"
              class="relative w-full h-32 border"
            >
              <img
                :src="image"
                alt="Uploaded image"
                class="w-full h-full object-cover rounded-md"
              />
              <button
                @click="removeImage(index)"
                class="absolute top-1 right-1 bg-red-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center"
              >
                <Close />
              </button>
            </div>
          </div>
          <div class="mt-4">
            <textarea
              v-model="message"
              name="reportDetails"
              placeholder="Describe the issue..."
              class="w-full border border-gray-300 rounded-md p-2"
              rows="4"
            ></textarea>
            <div class="w-full flex justify-end gap-2 mt-2">
              <button
                @click="isReportOpen = false"
                class="bg-red-500 rounded-md px-4 py-2 text-white"
              >
                Close
              </button>
              <button
                @click="submitReport"
                class="bg-blue-500 rounded-md px-4 py-2 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Confirmation Modals -->
    <ConfirmationModal
      :visible="isDeleteModalOpen"
      title="Confirm Deletion"
      message="Are you sure you want to delete this order?"
      @confirm="confirmDeleteOrder"
      @cancel="closeDeleteModal"
    />

    <ConfirmationModal
      :visible="isCancelModalOpen"
      title="Confirm Order"
      message="Are you sure you want to cancel this order?"
      @confirm="confirmCancelOrder"
      @cancel="closeCancelModal"
    />

    <ConfirmationModal
      :visible="isOrderModalOpen"
      title="Confirm Receipt"
      message="Did you receive your order?"
      @confirm="openFeedbackModal"
      @cancel="closeOrderModal"
    />

    <!-- Feedback Modal -->
    <section
      id="feedback"
      class="fixed flex justify-center items-center top-0 left-0 opacity-90 w-full h-full z-50"
      v-if="isFeedbackModalVisible"
    >
      <span
        class="fixed inset-0 bg-black opacity-90 z-10"
        @click="closeFeedbackModal"
      ></span>
      <div
        class="container bg-white flex flex-col justify-center items-center p-4 rounded shadow-lg z-40"
      >
        <div class="text-center">
          <h2 class="text-lg font-semibold">Feedback</h2>
          <p>Your feedback is important to us!</p>
          <textarea
            v-model="feedbackText"
            placeholder="Please enter your feedback here..."
            rows="4"
            class="w-full border border-gray-300 p-2 rounded mt-2"
          ></textarea>

          <div class="flex justify-center mt-2">
            <span
              v-for="star in 5"
              :key="star"
              @click="setRating(star)"
              class="cursor-pointer text-2xl"
              :class="{
                'text-yellow-500': star <= rating,
                'text-gray-300': star > rating,
              }"
            >
              ★
            </span>
          </div>
          <p class="mt-1">Rating: {{ rating }}</p>

          <button
            class="mt-4 px-4 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="submitFeedback"
          >
            Submit Feedback
          </button>
          <button
            class="mt-4 px-4 py-2 mx-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            @click="closeFeedbackModal"
          >
            Close
          </button>
        </div>
      </div>
    </section>

    <!-- Success and Error Modals -->
    <SuccessModal
      :visible="isSuccessModalVisible"
      :message="successMessage"
      @close="closeSuccessModal"
    />
    <ErrorModal
      :visible="isErrorModalVisible"
      :message="errorMessage"
      @close="closeErrorModal"
    />
    <ChatComponent />
    <FooterComponent />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "../../../axios";
import HeaderComponent from "./HeaderComponent.vue";
import ErrorModal from "../services/ErrorModal.vue";
import SuccessModal from "../services/SuccessModal.vue";
import ConfirmationModal from "../services/ConfirmationModal.vue";
import Info from "@/assets/icons/info.vue";
import { useToast } from "vue-toastification";
import Close from "@/assets/icons/close.vue";
import FooterComponent from "../buyerComponents/FooterComponent.vue";
import ChatComponent from "../../components/ChatComponent.vue";

const toast = useToast();

const rating = ref(0);
const orders = ref([]);
const feedbackText = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(true);
const isDeleteModalOpen = ref(false);
const isOrderModalOpen = ref(false);
const isReportOpen = ref(false);
const isCancelModalOpen = ref(false);
const isSuccessModalVisible = ref(false);
const isErrorModalVisible = ref(false);
const isFeedbackModalVisible = ref(false);
const selectedOrder = ref(null);
const isDetailsOpen = ref(false);
const reportMessage = ref("");
const reportedPersona = ref("Product");
const uploadedImages = ref([]);
const message = ref("");
const previewURLs = ref([]);

const images = ref([]);

const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => images.value.push(file));
  const fileURLs = files.map((file) => URL.createObjectURL(file));
  previewURLs.value.push(...fileURLs);
};

const submitReport = async () => {
  try {
    if (!images.value.length) {
      toast.error("Please upload at least one image", { timeout: 1000 });
      return;
    }

    const formData = new FormData();
    formData.append("pid", selectedOrder.value.SW_Pid);
    formData.append("uid", localStorage.getItem("Id"));
    formData.append("message", message.value);

    images.value.forEach((file, index) => {
      formData.append("images", file);
    });

    console.log("FormData Contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    const response = await axios.post("/report", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      toast.success("Report submitted successfully", { timeout: 1000 });
      reportedPersona.value = "Product";
      closeReport();
    } else {
      toast.error("Error submitting report", { timeout: 1000 });
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    toast.error(errorMessage, { timeout: 1000 });
  }
};

const removeImage = (index) => {
  previewURLs.value.splice(index, 1);
  images.value.splice(index, 1);
};

const setRating = (star) => {
  rating.value = star;
};

const selectedItem = (item) => {
  selectedOrder.value = item;
  isDetailsOpen.value = true;
};

const handleReport = () => {
  isReportOpen.value = true;
  isDetailsOpen.value = false;
};
const closeReport = () => {
  isReportOpen.value = false;
  isDetailsOpen.value = true;
};

function timeControl(isoDateString) {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const fetchOrders = async () => {
  loading.value = true;
  const userID = localStorage.getItem("Id");
  try {
    const response = await axios.get(`/user/orders/${userID}`);
    orders.value = response.data.response || [];
  } catch (error) {
    errorMessage.value = "No data is available.";
    isErrorModalVisible.value = true;
  } finally {
    loading.value = false;
  }
};

const openDeleteModal = (order) => {
  selectedOrder.value = order;
  isDeleteModalOpen.value = true;
};

const openCancelModal = (order) => {
  selectedOrder.value = order;
  isCancelModalOpen.value = true;
};

const openOrderReceivedModal = (order) => {
  selectedOrder.value = order;
  isOrderModalOpen.value = true;
};

const openFeedbackModal = () => {
  isOrderModalOpen.value = false;
  isFeedbackModalVisible.value = true;
};

const submitFeedback = async () => {
  if (!feedbackText.value) {
    alert("Please provide your feedback before proceeding.");
    return;
  }

  try {
    const response = await axios.post(`/feedback`, {
      user_id: localStorage.getItem("Id"),
      product_id: selectedOrder.value.SW_Pid,
      message: feedbackText.value,
      rating: rating.value,
    });

    // Check if the response indicates success
    if (response.status === 200) {
      await confirmReceivedOrder(); // Confirm order receipt
      closeFeedbackModal(); // Close feedback modal
      feedbackText.value = ""; // Reset feedback text
      successMessage.value = "Feedback submitted successfully!";
      isSuccessModalVisible.value = true;

      setTimeout(() => {
        isSuccessModalVisible.value = false;
      }, 1000);
    } else {
      // Handle any non-200 responses (e.g., 4xx, 5xx errors)
      errorMessage.value = "Error submitting feedback. Please try again later.";
      isErrorModalVisible.value = true;
      setTimeout(() => {
        isErrorModalVisible.value = false;
      }, 1000);
    }
  } catch (error) {
    // Handle network errors or other unexpected issues
    errorMessage.value = "Error submitting feedback. Please try again later.";
    isErrorModalVisible.value = true;
  }
};

const confirmDeleteOrder = async () => {
  isDeleteModalOpen.value = false;
  try {
    const response = await axios.delete(`/user/order/${selectedOrder.value.SW_Id}`);
    console.log(response);
    orders.value = orders.value.filter(
      (o) => o.SW_Id !== selectedOrder.value.SW_Id
    );
    successMessage.value = "Order deleted successfully.";
    isSuccessModalVisible.value = true;
    window.location.reload();
  } catch (error) {
    errorMessage.value = "Error deleting order. Please try again later.";
    isErrorModalVisible.value = true;
  }
};

const confirmCancelOrder = async () => {
  isCancelModalOpen.value = false;
  try {
    await axios.put(`/cancel/order`, {
      id: selectedOrder.value.SW_Pid,
      quantity: selectedOrder.value.SW_Quantity,
      size: selectedOrder.value.SW_Size,
    });

    await axios.delete(`/user/order/${selectedOrder.value.SW_Id}`);
    orders.value = orders.value.filter(
      (o) => o.SW_Id !== selectedOrder.value.SW_Id
    );
    successMessage.value = "Order cancelled successfully.";
    isSuccessModalVisible.value = true;
    window.location.reload();
  } catch (error) {
    errorMessage.value = "Error cancelling order. Please try again later.";
    isErrorModalVisible.value = true;
  }
};

const confirmReceivedOrder = async () => {
  try {
    await axios.put(`/order/received/${selectedOrder.value.SW_Id}`);
    selectedOrder.value.SW_Status = true; // Update order status
    window.location.reload();
  } catch (error) {
    errorMessage.value =
      "Error marking order as received. Please try again later.";
    isErrorModalVisible.value = true;
  }
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
};
const closeCancelModal = () => {
  isCancelModalOpen.value = false;
};
const closeSuccessModal = () => {
  isSuccessModalVisible.value = false;
};
const closeOrderModal = () => {
  isOrderModalOpen.value = false;
};
const closeErrorModal = () => {
  isErrorModalVisible.value = false;
};
const closeFeedbackModal = () => {
  isFeedbackModalVisible.value = false;
  feedbackText.value = "";
};
const chatModalShow = (orders) => {
  localStorage.setItem("seller_id", orders.SW_Seller_id);
  localStorage.setItem("seller_fullname", orders.SW_Seller_name);
  localStorage.setItem("statusMode", 'online');
  location.reload();
};
onMounted(fetchOrders);
</script>

<style scoped>
table {
  border-collapse: collapse;
}

th,
td {
  text-align: left;
}

th {
  background-color: #2d2d2d;
}

tbody tr:hover {
  background-color: #444;
}

.imageGrid button {
  background: red;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
