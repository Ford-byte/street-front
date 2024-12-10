<template>
  <div>
    <div
      class="container md:block flex flex-col justify-center h-full mx-auto p-4 sm:mt-12 absolute bottom-12 sm:relative md:relative"
    >
      <div
        class="flex flex-col md:flex-row md:justify-between items-center mb-4"
      >
        <h1 class="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
          Feedbacks
        </h1>
        <div class="mb-4 md:mb-0">
          <div
            class="flex overflow-hidden rounded-lg dark:bg-gray-50 dark:text-gray-800 w-full m-4"
          >
            <div
              class="flex items-center justify-center px-4 dark:bg-gray-600 dark:text-gray-100"
            >
              <Envelope />
            </div>
            <div class="flex items-center justify-between flex-1 p-3">
              <p class="text-2xl font-semibold">{{ feedbackCount }}</p>
              <p>Feedbacks</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="text-red-600 mt-4">
        {{ errorMessage }}
      </div>

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
                Date
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Message
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedFeedbacks.length === 0">
              <td colspan="4" class="py-3 px-4 text-gray-600 text-center">
                No feedbacks found.
              </td>
            </tr>
            <tr
              v-for="(feedback) in paginatedFeedbacks"
              :key="feedback.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="py-3 px-4 text-gray-800">{{ feedback.fullname }}</td>
              <td class="py-3 px-4 text-gray-600">
                {{ formatDate(feedback.isCreated) }}
              </td>
              <td class="py-3 px-4 text-gray-600">{{ feedback.message }}</td>
              <td class="py-3 px-4">
                <button
                  @click="openModal(feedback)"
                  class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 m-1"
                >
                  View Details
                </button>
                <button
                  @click="confirmDelete(feedback.feedbackId)"
                  class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 m-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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

      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h2 class="text-xl font-semibold mb-4">Feedback Details</h2>
          <p><strong>Name:</strong> {{ currentFeedback.fullname }}</p>
          <p>
            <strong>Date:</strong> {{ formatDate(currentFeedback.isCreated) }}
          </p>
          <p><strong>Message:</strong> {{ currentFeedback.message }}</p>
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

      <ConfirmationModal
        :visible="isDeleteModalOpen"
        title="Confirm Deletion"
        message="Are you sure you want to delete this feedback?"
        @confirm="deleteFeedback(feedbackIdToDelete)"
        @cancel="closeDeleteModal"
      />
    </div>
  </div>
</template>
  
  <script setup>
import axios from "../../../axios"; // Ensure this is the correct relative path
import { ref, computed, onMounted } from "vue";
import ConfirmationModal from "../services/ConfirmationModal.vue";
import Envelope from "@/assets/icons/envelope.vue"; // Ensure alias `@` works as expected
import { useToast } from "vue-toastification";

const toast = useToast();

const feedbacks = ref([]);
const isModalOpen = ref(false);
const currentFeedback = ref({});
const currentPage = ref(1);
const perPage = ref(4);
const errorMessage = ref("");
const isDeleteModalOpen = ref(false);
const feedbackIdToDelete = ref(null);

const fetchFeedbacks = async () => {
  try {
    const response = await axios.get("/feedbacks");
    feedbacks.value = response.data.response || [];
    errorMessage.value = "";
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    feedbacks.value = [];
    errorMessage.value = "Error fetching feedbacks. Please try again later.";
    toast.error("Failed to fetch feedbacks.");
  }
};

// Computed properties
const feedbackCount = computed(() => feedbacks.value.length);
const totalPages = computed(() =>
  Math.ceil(feedbacks.value.length / perPage.value)
);
const paginatedFeedbacks = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return feedbacks.value.slice(start, start + perPage.value);
});

// Modal handlers
const openModal = (feedback) => {
  currentFeedback.value = { ...feedback };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  currentFeedback.value = {};
};

// Delete confirmation modal
const confirmDelete = (feedbackId) => {
  feedbackIdToDelete.value = feedbackId;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  feedbackIdToDelete.value = null;
};

// Delete feedback
const deleteFeedback = async (feedbackId) => {
  try {
    await axios.delete(`/feedback/${feedbackId}`);
    feedbacks.value = feedbacks.value.filter(
      (feedback) => feedback.id !== feedbackId
    );
    closeDeleteModal();
    toast.success("Feedback deleted successfully!");
  } catch (error) {
    console.error("Error deleting feedback:", error);
    errorMessage.value = "Failed to delete feedback. Please try again.";
    toast.error("Failed to delete feedback.");
  }
};

// Pagination controls
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

// Utility: Format ISO date to YYYY-MM-DD
function formatDate(isoDateString) {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Lifecycle hook
onMounted(() => {
  fetchFeedbacks();
});
</script>
  