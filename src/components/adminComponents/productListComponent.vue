<template>
    <div class="container mx-auto p-4">
        <div class="flex flex-col md:flex-row md:justify-between items-center mb-4">
            <h1 class="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Product List</h1>
            <div class="mb-4 md:mb-0">
                <div class="flex overflow-hidden rounded-lg dark:bg-gray-50 dark:text-gray-800 w-44 m-4">
                    <div class="flex items-center justify-center px-4 dark:bg-gray-600 dark:text-gray-100">
                        <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                            <path d="M4 4h16v2H4zm0 4h16v2H4zm0 4h16v2H4zm0 4h16v2H4zm0 4h16v2H4z" />
                            <path d="M4 2C2.89 2 2 2.89 2 4v16c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2H4zm0 2h16v16H4V4z" />
                        </svg> -->
                        <Product />
                    </div>
                    <div class="flex items-center justify-between flex-1 p-3">
                        <p class="text-2xl font-semibold">{{ productCount }}</p>
                        <p>Product</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                    <tr class="bg-gray-100 border-b">
                        <th class="py-3 px-4 text-left text-gray-600 font-medium">No</th>
                        <th class="py-3 px-4 text-left text-gray-600 font-medium">Name</th>
                        <th class="py-3 px-4 text-left text-gray-600 font-medium">Category</th>
                        <th class="py-3 px-4 text-left text-gray-600 font-medium">Price</th>
                        <th class="py-3 px-4 text-left text-gray-600 font-medium flex justify-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="paginatedProducts.length === 0">
                        <td colspan="7" class="py-3 px-4 text-gray-600 text-center">No products found.</td>
                    </tr>
                    <tr v-for="(product, index) in paginatedProducts" :key="product.SW_Id"
                        class="border-b hover:bg-gray-50">
                        <td class="py-3 px-4 text-gray-800">{{ index + 1 }}</td>
                        <td class="py-3 px-4 text-gray-800">{{ product.SW_Name }}</td>
                        <td class="py-3 px-4 text-gray-600">{{ product.SW_Category }}</td>
                        <td class="py-3 px-4 text-gray-600">{{ product.SW_Price }}</td>
                        <td class="py-3 px-4">
                            <button @click="toggleApproval(product)"
                                :class="product.SW_IsApproved ? 'bg-blue-500' : 'bg-red-500'"
                                class="text-white px-2 py-1 rounded m-2">
                                {{ product.SW_IsApproved ? 'Approved' : 'Disapproved' }}
                            </button>
                            <button @click="openModal(product)"
                                class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 m-2">View</button>
                            <button @click="confirmDelete(product.SW_Id)"
                                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 m-2">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex justify-between items-center mt-4">
            <button @click="prevPage" :disabled="currentPage === 1"
                class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300">Next</button>
        </div>

        <!-- Edit Modal -->
        <div v-if="isModalOpen"
            class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <h2 class="text-xl font-semibold mb-4">View Product</h2>
                <form>

                    <div>
                        <!-- Paginated Images -->
                        <div class="py-3 px-4 justify-center flex flex-wrap">
                            <div v-for="(item, index) in paginatedImages" :key="index" class="m-2">
                                <img :src="getImageUrl(item)" alt="Product Image"
                                    class="w-24 h-24 rounded object-cover">
                            </div>
                        </div>

                        <!-- Pagination Controls -->
                        <div class="flex justify-center space-x-2 mt-4">
                            <button @click="changePage(currentImage - 1)" :disabled="currentImage === 1"
                                class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">
                                Previous
                            </button>
                            <span class="px-3 py-1">{{ currentImage }} / {{ totalImage }}</span>
                            <button @click="changePage(currentImage + 1)" :disabled="currentImage === totalImage"
                                class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-gray-700">Name</label>
                        <input v-model="currentProduct.SW_Name" type="text"
                            class="w-full border border-gray-300 p-2 rounded-md" required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Price</label>
                        <input v-model="currentProduct.SW_Price" type="number"
                            class="w-full border border-gray-300 p-2 rounded-md" required />
                    </div>
                    <div class="flex justify-end">
                        <button @click="closeModal" type="button"
                            class="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600">Cancel</button>
                        <button type="submit"
                            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
                    </div>
                </form>
            </div>
        </div>

        <ConfirmationModal :visible="isDeleteModalOpen" title="Confirm Deletion"
            message="Are you sure you want to delete this product?" @confirm="deleteProduct(userIdToDelete)"
            @cancel="closeDeleteModal" />

        <ConfirmationModal :visible="isApprovedModalOpen" title="Confirm Approval" :message="approveMessage"
            @confirm="confirmApproval" @cancel="closeApproveModal" />

        <ErrorModal :visible="isErrorModalVisible" :message="errorMessage" @close="isErrorModalVisible = false"
            :timeout="1500" />

        <SuccessModal :visible="isSuccessModalVisible" message="Operation successful!"
            @close="isSuccessModalVisible = false" />
    </div>
</template>

<script setup>
import axios, { backLink } from '../../../axios';
import { ref, computed, onMounted } from 'vue';
import ErrorModal from '../services/ErrorModal.vue';
import SuccessModal from '../services/SuccessModal.vue';
import ConfirmationModal from '../services/ConfirmationModal.vue';
import Users from '@/assets/icons/users.vue';
import Product from '@/assets/icons/product.vue';

const products = ref([]);
const isModalOpen = ref(false);
const currentProduct = ref({});
const currentPage = ref(1);
const perPage = ref(4);
const approveMessage = ref('');
const isDeleteModalOpen = ref(false);
const isApprovedModalOpen = ref(false);
const userIdToDelete = ref(null);
const isSuccessModalVisible = ref(false);
const isErrorModalVisible = ref(false);
const userIdToApprove = ref('');
const errorMessage = ref('');

const imageLength = computed(() => {
    return currentProduct.value?.SW_Images?.length || 0;
});

const imagePerPage = ref(1);
const currentImage = ref(1);

const totalImage = computed(() => {
    return imagePerPage.value > 0 ? Math.ceil(imageLength.value / imagePerPage.value) : 0;
});

const paginatedImages = computed(() => {
    const images = currentProduct.value?.SW_Images || [];
    const startIndex = (currentImage.value - 1) * imagePerPage.value;
    const endIndex = startIndex + imagePerPage.value;
    return images.slice(startIndex, endIndex);
});

const changePage = (page) => {
    if (page >= 1 && page <= totalImage.value) {
        currentImage.value = page; // Update the current page if within bounds
    }
};


const firstImage = () => {
    currentProduct.value.SW_Images = currentProduct.value.SW_Images.split(',');
}

// Fetch products
const fetchProducts = async () => {
    try {
        const response = await axios.get('/products');
        products.value = response.data.products || [];
        errorMessage.value = '';
    } catch (error) {
        handleError(`Error: ${error}`);
    }
};

// Handle errors
const handleError = (message) => {
    errorMessage.value = message;
    isErrorModalVisible.value = true;
    setTimeout(() => {
        isErrorModalVisible.value = false;
    }, 1500);
};

// Handle success
const handleSuccess = (message) => {
    isSuccessModalVisible.value = true;
    setTimeout(() => {
        isSuccessModalVisible.value = false;
    }, 1500);
};

// Get image URL
const getImageUrl = (imagePath) => {
    return imagePath ? `${backLink}/images/${imagePath}` : 'default-image-url';
};

// Computed properties
const productCount = computed(() => products.value.length);
const totalPages = computed(() => Math.ceil(productCount.value / perPage.value));

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return products.value.slice(start, start + perPage.value);
});

// Approval logic
const toggleApproval = (product) => {
    approveMessage.value = product.SW_IsApproved ? "Are you sure you want to disapprove this product?" : "Are you sure you want to approve this product?";
    userIdToApprove.value = product;
    isApprovedModalOpen.value = true;
};

const confirmApproval = async () => {
    const product = userIdToApprove.value;
    try {
        product.SW_IsApproved ? await disapproveProduct(product) : await approveProduct(product);
        closeApproveModal();
    } catch {
        handleError('Error during approval process.');
    }
};

const approveProduct = async (product) => {
    try {
        await axios.put(`/product/approve/${product.SW_Id}`);
        product.SW_IsApproved = true;
        handleSuccess('Product approved successfully.');
    } catch {
        handleError('Error approving product. Please try again.');
        product.SW_IsApproved = false;
    }
};

const disapproveProduct = async (product) => {
    try {
        await axios.put(`/product/disapprove/${product.SW_Id}`);
        product.SW_IsApproved = false;
        handleSuccess('Product disapproved successfully.');
    } catch {
        handleError('Error disapproving product. Please try again.');
        product.SW_IsApproved = true;
    }
};

// Update product
const updateProduct = async () => {
    try {
        await axios.put(`/product/${currentProduct.value.SW_Id}`, currentProduct.value);
        const index = products.value.findIndex(product => product.SW_Id === currentProduct.value.SW_Id);
        if (index !== -1) {
            products.value.splice(index, 1, currentProduct.value);
        }
        handleSuccess('Product updated successfully.');
        closeModal();
    } catch {
        handleError('Error updating product. Please try again.');
    }
};

// Delete product
const deleteProduct = async (productId) => {
    try {
        await axios.delete(`/product/${productId}`);
        products.value = products.value.filter(product => product.SW_Id !== productId);
        closeDeleteModal();
        handleSuccess('Product deleted successfully.');
    } catch {
        handleError('Error deleting product. Please try again.');
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

// Modal handling
const openModal = (product) => {
    currentProduct.value = { ...product };
    isModalOpen.value = true;
    firstImage();
};

const closeModal = () => {
    isModalOpen.value = false;
    currentProduct.value = {};
};

const confirmDelete = (productId) => {
    userIdToDelete.value = productId;
    isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    userIdToDelete.value = null;
};

const closeApproveModal = () => {
    isApprovedModalOpen.value = false;
};

// Lifecycle hook
onMounted(fetchProducts);
</script>
