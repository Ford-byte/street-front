<template>
  <div>
    <div class="container mx-auto p-4">
      <!-- Report Table Section -->
      <div
        class="flex flex-col md:flex-row md:justify-between items-center mb-4"
      >
        <h1 class="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
          Reports List
        </h1>
        <div class="mb-4 md:mb-0">
          <div
            class="flex overflow-hidden rounded-lg dark:bg-gray-50 dark:text-gray-800 w-44 m-4"
          >
            <div
              class="flex items-center justify-center px-4 dark:bg-gray-600 dark:text-gray-100"
            >
              <Product />
            </div>
            <div class="flex items-center justify-between flex-1 p-3">
              <p class="text-2xl font-semibold">{{ reportsCount }}</p>
              <p>Reports</p>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table
          class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md"
        >
          <thead>
            <tr class="bg-gray-100 border-b">
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Reporter name
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Message
              </th>
              <th
                class="py-3 px-4 text-left text-gray-600 font-medium flex justify-center"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedReports.length === 0">
              <td colspan="4" class="py-3 px-4 text-gray-600 text-center">
                No reports found.
              </td>
            </tr>
            <tr
              v-for="(report, index) in paginatedReports"
              :key="index"
              class="border-b hover:bg-gray-50"
            >
              <td class="py-3 px-4 text-gray-800">{{ report.fullname }}</td>
              <td class="py-3 px-4 text-gray-600">{{ report.message }}</td>
              <td class="py-3 px-4">
                <button
                  @click="openReportModal(report)"
                  class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 m-2"
                >
                  View
                </button>
                <button
                  @click="confirmDelete(report.reportId)"
                  class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 m-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center mt-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="bg-transparent text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="bg-transparent text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Report Modal -->
    <div
      v-if="reportModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      @click.self="closeReport"
    >
      <div
        class="bg-white p-6 rounded-lg max-w-[1000px] max-h-[500px] shadow-lg relative z-10"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Report Details</h2>

        <div class="mb-4 flex justify-between">
          <div>
            <p class="text-gray-600 capitalize">
              <strong>Name:</strong> {{ selectedReport.fullname }}
            </p>
            <p class="text-gray-600 normal-case max-w-[200px] md:max-w-3/4">
              <strong>Concern:</strong> {{ selectedReport.message }}
            </p>
          </div>
          <img
            :src="getImageUrl(selectedReport.images)"
            alt="profile"
            class="size-12 rounded-full m-2"
          />
        </div>

        <!-- Image Carousel (if images are available) -->
        <div
          v-if="imageArray.length > 0"
          class="relative w-full h-64 rounded overflow-hidden"
        >
          <img
            :src="getImageUrl(imageArray[currentImageIndex])"
            alt="Slide Image"
            class="w-full h-64 object-cover"
          />

          <div class="absolute top-1/2 left-0 right-0 flex justify-between">
            <button
              @click="prevImage"
              :disabled="currentImageIndex === 0"
              class="bg-gray-500 text-white px-3 py-3 rounded-full hover:bg-gray-400 disabled:bg-gray-300"
            >
              <Arrowleft class="text-blue-500" />
            </button>
            <button
              @click="nextImage"
              :disabled="currentImageIndex === imageArray.length - 1"
              class="bg-gray-500 text-white px-3 py-3 rounded-full hover:bg-gray-400 disabled:bg-gray-300"
            >
              <Arrowright class="text-blue-500" />
            </button>
          </div>
        </div>
        <div class="flex justify-center py-2 text-sm font-bold text-gray-600">
          {{ currentImageIndex + 1 + "/" + imageArray.length }}
        </div>
        <div class="flex justify-end">
          <button
            @click="closeReport"
            class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <ConfirmationModal
      :visible="isDeleteModalOpen"
      title="Confirm Deletion"
      message="Are you sure you want to delete this report?"
      @confirm="deleteReport(userIdToDelete)"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup>
import axios, { backLink } from "../../../axios";
import { ref, computed, onMounted } from "vue";
import Product from "@/assets/icons/product.vue";
import ConfirmationModal from "../services/ConfirmationModal.vue";
import Arrowleft from "@/assets/icons/arrowleft.vue";
import Arrowright from "@/assets/icons/arrowright.vue";
import { useToast } from "vue-toastification";

const toast = useToast();

const getImageUrl = (imageName) => `${backLink}/images/${imageName}`;

const reports = ref([]);
const currentPage = ref(1);
const perPage = ref(4);
const isDeleteModalOpen = ref(false);
const errorMessage = ref("");
const userIdToDelete = ref(null);
const reportModal = ref(false);
const selectedReport = ref({});
const imageArray = ref([]);
const currentImageIndex = ref(0);

// Fetch reports
const fetchReports = async () => {
  try {
    const response = await axios.get("/reports");
    reports.value = response.data || [];
    errorMessage.value = "";
  } catch (error) {
    handleError(`Error: ${error}`);
  }
};

const openReportModal = (report) => {
  selectedReport.value = report;
  imageArray.value = report.reportedImages.split(",");
  currentImageIndex.value = 0; // Reset the image index when opening modal
  reportModal.value = true;
};

const closeReport = () => {
  reportModal.value = false;
  selectedReport.value = null;
  imageArray.value = [];
};

const deleteReport = async (id) => {
  try {
    const response = await axios.delete(`/report/${id}`);
    errorMessage.value = "";
    if (response.status === 200) {
      handleSuccess("Report deleted successfully!");
      isDeleteModalOpen.value = false;
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  } catch (error) {
    handleError(`Error: ${error}`);
  }
};

const handleError = (message) => {
  errorMessage.value = message;
  toast.error(message, { timeout: 2000 });
};

const handleSuccess = (message) => {
  toast.success(message, { timeout: 2000 });
};

const confirmDelete = (id) => {
  userIdToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const reportsCount = computed(() => reports.value.length);

const totalPages = computed(() =>
  Math.ceil(reportsCount.value / perPage.value)
);
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return reports.value.slice(start, start + perPage.value);
});

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

const nextImage = () => {
  if (currentImageIndex.value < imageArray.value.length - 1) {
    currentImageIndex.value++;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

// Lifecycle hook
onMounted(() => {
  fetchReports();
});
</script>
