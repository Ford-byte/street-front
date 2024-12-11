<template>
  <div>
    <div
      class="container flex justify-center flex-col h-full md:block mx-auto p-4 sm:mt-12 absolute bottom-12 sm:relative md:relative">
      <!-- Header and Order Counter -->
      <div class="flex flex-col md:flex-row md:justify-between items-center mb-4">
        <h1 class="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
          Product List
        </h1>
        <div class="mb-4 md:mb-0">
          <div class="flex overflow-hidden rounded-lg dark:bg-gray-50 dark:text-gray-800 w-full m-4">
            <div class="flex items-center justify-center px-4 dark:bg-gray-600 dark:text-gray-100">
              <Product />
            </div>
            <div class="flex items-center justify-between flex-1 p-3">
              <p class="text-2xl font-semibold">{{ productCount }}</p>
              <p>Products</p>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr class="bg-gray-100 border-b">
              <th class="py-3 px-4 text-left text-gray-600 font-medium">No</th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Name
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Price
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Category
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium flex justify-center">
                Action
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                Status
              </th>
              <th class="py-3 px-4 text-left text-gray-600 font-medium">
                <button class="flex items-center" @click="openAddModal">
                  <Plus />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedProducts.length === 0">
              <td colspan="8" class="py-3 px-4 text-gray-600 text-center">
                No products found.
              </td>
            </tr>
            <tr v-for="(product, index) in paginatedProducts" :key="product.SW_Id"
              class="border-b hover:bg-gray-50 cursor-pointer" @click="showProductDetails(product)">
              <td class="py-3 px-4 text-gray-800">{{ index + 1 }}</td>
              <td class="py-3 px-4 text-gray-800">{{ product.SW_Name }}</td>
              <td class="py-3 px-4 text-gray-600">{{ product.SW_Price }}</td>
              <td class="py-3 px-4 text-gray-600">{{ product.SW_Category }}</td>
              <td class="py-3 px-4 flex">
                <button @click.stop="openEditModal(product)"
                  class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 m-2">
                  Edit
                </button>
                <button @click.stop="confirmDelete(product.SW_Id)"
                  class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 m-2">
                  Delete
                </button>
              </td>
              <td>
                <div class="flex items-center p-2 rounded-md">
                  <!-- <i v-if="product.SW_IsApproved === 1"
                                    class="fas fa-check-circle text-green-600 mr-2"></i> -->
                  <Check v-if="product.SW_IsApproved === 1" class="text-green-600 mr-2" />
                  <!-- <i v-else class="fas fa-times-circle text-red-600 mr-2"></i> -->
                  <Wrong v-else class="text-red-600 mr-2" />
                  <p>
                    {{
                      product.SW_IsApproved === 1 ? "Approved" : "Not Approved"
                    }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-between items-center mt-4 mb-24">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300">
          Next
        </button>
      </div>

      <!-- Product Details Modal -->
      <div v-if="isDetailsModalOpen"
        class="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-scroll">
        <div
          class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto transition-transform transform scale-100 hover:scale-105">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
            Product Details
          </h2>
          <div class="flex justify-center mb-4">
            <div v-for="(item, index) in paginatedItems" :key="index" class="pt-24">
              <img :src="getImageUrl(item.image)" alt="Product Image"
                class="w-[400px] h-[300px] rounded-lg shadow-md object-cover border-2 border-gray-200" />
            </div>
          </div>

          <!-- Pagination Controls -->
          <div class="flex justify-center text-xs">
            <button @click="goToPage(paginateCurrentPage - 1)" :disabled="paginateCurrentPage === 1"
              class="px-4 py-2 bg-blue-500 text-white rounded">
              {{ '<' }} </button>
                <span class="px-4 py-2">{{ paginateCurrentPage }} / {{ paginateTotalPages }}</span>
                <button @click="goToPage(paginateCurrentPage + 1)"
                  :disabled="paginateCurrentPage === paginateTotalPages"
                  class="px-4 py-2 bg-blue-500 text-white rounded">
                  {{ '>' }}
                </button>
          </div>

          <div class="space-y-3">
            <p class="text-gray-700">
              <strong>Name:</strong>
              <span class="font-semibold">{{ selectedProduct.SW_Name }}</span>
            </p>
            <p class="text-gray-700"><strong>In Stock</strong></p>
            <p class="text-gray-700">
              <strong>Small:</strong>
              <span class="font-semibold">{{
                selectedProduct.SW_Small + "pcs"
              }}</span>
            </p>
            <p class="text-gray-700">
              <strong>Medium:</strong>
              <span class="font-semibold">{{
                selectedProduct.SW_Medium + "pcs"
              }}</span>
            </p>
            <p class="text-gray-700">
              <strong>Large:</strong>
              <span class="font-semibold">{{
                selectedProduct.SW_Large + "pcs"
              }}</span>
            </p>
            <p class="text-gray-700">
              <strong>Extra Large:</strong>
              <span class="font-semibold">{{
                selectedProduct.SW_X_large + "pcs"
              }}</span>
            </p>
            <p class="text-gray-700">
              <strong>Category:</strong>
              <span class="font-semibold">{{
                selectedProduct.SW_Category
              }}</span>
            </p>
            <p class="text-gray-700">
              <strong>Price:</strong>
              <span class="font-semibold text-green-600">₱{{ selectedProduct.SW_Price }}</span>
            </p>
          </div>
          <div class="flex justify-end mt-6">
            <button @click="closeDetailsModal"
              class="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition duration-200">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Edit/Add Modal -->
      <div v-if="isModalOpen"
        class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-scroll">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-24">
          <div v-if="isAddModalOpen">
            <h2 class="text-xl font-semibold mb-4">Add Product</h2>
            <form @submit.prevent="addProduct()">
              <div class="py-3 px-4 justify-center flex flex-col items-center">
                <input type="file" @change="onFileChange" id="imageUpload" accept="image/*" multiple class="mb-3" />
                <div v-if="imageSrc.length" class="grid grid-cols-3 gap-4">
                  <div v-for="(src, index) in imageSrc" :key="index" class="relative group">
                    <!-- Image Preview -->
                    <img :src="src" alt="Preview of uploaded image" class="w-full h-auto max-h-48 object-contain" />
                    <!-- Close Mark -->
                    <button @click="removeImage(index)"
                      class="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Image">
                      x
                    </button>
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700">Name</label>
                <input v-model="name" type="text" class="w-full border border-gray-300 p-2 rounded-md" required />
              </div>

              <div class="mb-4">
                <label class="block text-gray-700">Size</label>
                <div class="grid grid-cols-4 px-4 gap-4">
                  <div>
                    <input type="number" :min="0" v-model="stockSmall" placeholder="Small"
                      class="cols-span-1 w-full p-2 border border-black rounded-md" />
                  </div>
                  <div>
                    <input type="number" :min="0" v-model="stockMedium" placeholder="Medium"
                      class="cols-span-1 w-full p-2 border border-black rounded-md" />
                  </div>
                  <div>
                    <input type="number" :min="0" v-model="stockLarge" placeholder="Large"
                      class="cols-span-1 w-full p-2 border border-black rounded-md" />
                  </div>
                  <div>
                    <input type="number" :min="0" v-model="stockXlarge" placeholder="Extra Large"
                      class="cols-span-1 w-full p-2 border border-black rounded-md" />
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700">Price</label>
                <div class="grid grid-cols-4 px-4">
                  <input type="input" v-model="price" placeholder="Price"
                    class="cols-span-1 w-full p-2 border border-black rounded-md" />
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700">Category</label>
                <div class="flex">
                  <label class="inline-flex items-center mx-2">
                    <input type="radio" v-model="category" value="shorts" class="form-radio" />
                    <span class="ml-2">Shorts</span>
                  </label>
                  <label class="inline-flex items-center mx-2">
                    <input type="radio" v-model="category" value="tshirt" class="form-radio" />
                    <span class="ml-2">T-Shirt</span>
                  </label>
                  <label class="inline-flex items-center mx-2">
                    <input type="radio" v-model="category" value="shoes" class="form-radio" />
                    <span class="ml-2">Shoes</span>
                  </label>
                </div>
              </div>

              <div class="flex justify-end">
                <button @click="closeModal" type="button"
                  class="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600">
                  Cancel
                </button>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Save
                </button>
              </div>
            </form>
          </div>

          <div v-else>
            <h2 class="text-xl font-semibold mb-4">Edit Product</h2>
            <form @submit.prevent="updateProduct()">
              <!-- <div class="py-3 px-4 justify-center flex">
                            <img :src="getImageUrl(currentProduct.SW_Images)" alt="Product Image"
                                class="w-24 h-24 rounded object-cover">
                        </div> -->

              <div class="mb-4">
                <label class="block text-gray-700">Name</label>
                <input v-model="currentProduct.SW_Name" type="text" class="w-full border border-gray-300 p-2 rounded-md"
                  required />
              </div>

              <div class="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700">Price</label>
                  <input v-model="currentProduct.SW_Price" type="number"
                    class="w-full border border-gray-300 p-2 rounded-md" required />
                </div>
                <div>
                  <label class="block text-gray-700">Discount</label>
                  <input v-model="currentProduct.SW_Discount" type="number"
                    class="w-full border border-gray-300 p-2 rounded-md" required />
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700">Size</label>
                <div class="grid grid-cols-4 gap-4 px-4 py-2">
                  <div>
                    <input type="number" v-model="currentProduct.SW_Small"
                      class="cols-span-1 w-full p-2 border border-black rounded-md" />
                  </div>
                  <div>
                    <input type="number" v-model="currentProduct.SW_Medium"
                      class="cols-span-1 w-full p-2 border border-black rounded-md" />
                  </div>
                  <div>
                    <input type="number" v-model="currentProduct.SW_Large"
                      class="cols-span-1 w-full p-2 border border-black rounded-md" />
                  </div>
                  <div>
                    <input type="number" v-model="currentProduct.SW_X_large"
                      class="cols-span-1 w-full p-2 border border-black rounded-md" />
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700">Category</label>
                <label class="inline-flex items-center mx-2">
                  <input type="radio" v-model="currentProduct.SW_Category" value="shorts" class="form-radio" />
                  <span class="ml-2">Shorts</span>
                </label>
                <label class="inline-flex items-center mx-2">
                  <input type="radio" v-model="currentProduct.SW_Category" value="tshirt" class="form-radio" />
                  <span class="ml-2">T-Shirt</span>
                </label>
                <label class="inline-flex items-center mx-2">
                  <input type="radio" v-model="currentProduct.SW_Category" value="shoes" class="form-radio" />
                  <span class="ml-2">Shoes</span>
                </label>
              </div>

              <div class="flex justify-end">
                <button @click="closeModal" type="button"
                  class="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600">
                  Cancel
                </button>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <ConfirmationModal :visible="isDeleteModalOpen" title="Confirm Deletion"
      message="Are you sure you want to delete this product?" @confirm="deleteProduct(userIdToDelete)"
      @cancel="closeDeleteModal" />
    <SuccessModal :visible="isSuccessModalVisible" :message="successMessage" @close="isSuccessModalVisible = false" />
    <ErrorModal :visible="isErrorModalVisible" :message="errorMessage" @close="isErrorModalVisible = false" />
  </div>
</template>

<script setup>
import axios, { backLink } from "../../../axios";
import { ref, computed, onMounted } from "vue";
import ErrorModal from "../services/ErrorModal.vue";
import SuccessModal from "../services/SuccessModal.vue";
import ConfirmationModal from "../services/ConfirmationModal.vue";
import Product from "@/assets/icons/product.vue";
import Plus from "@/assets/icons/plus.vue";
import Check from "@/assets/icons/check.vue";
import Wrong from "@/assets/icons/wrong.vue";

const products = ref([]);
const isModalOpen = ref(false);
const isAddModalOpen = ref(false);
const isDetailsModalOpen = ref(false);
const selectedProduct = ref({});
const currentProduct = ref({});
const currentPage = ref(1);
const perPage = ref(4);
const errorMessage = ref("");
const isDeleteModalOpen = ref(false);
const userIdToDelete = ref(null);
const isSuccessModalVisible = ref(false);
const successMessage = ref("");
const image = ref(null);
const name = ref("");
const stockSmall = ref("");
const stockMedium = ref("");
const stockLarge = ref("");
const stockXlarge = ref("");
const price = ref(0);
const category = ref("");
const imageSrc = ref(""); // Reactive reference for image source
const images = ref([]);

const imageObjects = ref([]); // Initialize with an empty array
const itemsPerPage = 1; // Adjust based on how many items you want per page
const paginateCurrentPage = ref(1);

// Compute the total pages
const paginateTotalPages = computed(() =>
  Math.ceil(imageObjects.value.length / itemsPerPage)
);

// Compute the paginated items
const paginatedItems = computed(() => {
  const start = (paginateCurrentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return imageObjects.value.slice(start, end);
});

// Method to go to a specific page
const goToPage = (page) => {
  if (page < 1 || page > paginateTotalPages.value) return;
  paginateCurrentPage.value = page;
};

// Handle file input change
const onFileChange = (event) => {
  const files = event.target.files; // Get all selected files
  if (files.length > 0) {
    const imagesArray = []; // Array to store file objects
    const imagePreviews = []; // Array to store data URLs for previews

    Array.from(files).forEach((file) => {
      const reader = new FileReader(); // Create a FileReader instance for each file

      reader.onload = (e) => {
        imagePreviews.push(e.target.result); // Add the preview URL
        imagesArray.push(file); // Store the file object

        // Optional: Update the reactive variables when all files are processed
        if (imagePreviews.length === files.length) {
          imageSrc.value = imagePreviews; // Update with all preview URLs
          images.value = imagesArray; // Update with all file objects
        }
      };

      reader.readAsDataURL(file); // Read each file as a data URL
    });
  } else {
    images.value = []; // Clear the files array if none are selected
  }
};
const removeImage = (index) => {
  imageSrc.value.splice(index, 1); // Remove the preview from the imageSrc array
  images.value.splice(index, 1); // Remove the corresponding file from the images array
};

// Add product
const addProduct = async () => {
  const formData = new FormData();

  images.value.forEach((image, index) => {
    formData.append(`images`, image); // Use a unique key for each image
  });

  // Append other form data
  formData.append("name", name.value);
  formData.append("id", localStorage.getItem("Id"));
  formData.append("stockSmall", stockSmall.value);
  formData.append("stockMedium", stockMedium.value);
  formData.append("stockLarge", stockLarge.value);
  formData.append("stockXlarge", stockXlarge.value);
  formData.append("price", price.value);
  formData.append("category", category.value);
  formData.append("seller_id", localStorage.getItem("Id"));

  try {
    const response = await axios.post("/product", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure the content type is set correctly
      },
    });

    // Update the products list with the newly added product
    products.value.push(response.data);

    // Show success message and modal
    successMessage.value = "Product added successfully!";
    isSuccessModalVisible.value = true;

    setTimeout(() => {
      closeModal();
      isSuccessModalVisible.value = false;
      window.location.reload();
    }, 2000);
  } catch (error) {
    // Show error message and modal
    errorMessage.value = "Failed to add product. Please try again.";
    isErrorModalVisible.value = true;
  }
};

// Fetch products
const fetchProducts = async () => {
  try {
    const response = await axios.get("/products");
    products.value = response.data.products || [];
    // console.log(products);
    errorMessage.value = "";
  } catch (error) {
    errorMessage.value = "Error fetching products. Please try again later.";
    console.error("Error fetching products:", error);
    isErrorModalVisible.value = true; // Show error modal
  }
};

// Get image URL
const getImageUrl = (imagePath) => {
  return imagePath ? `${backLink}/images/${imagePath}` : "default-image-url";
};

// Computed properties
const productCount = computed(() => products.value.length);
const totalPages = computed(() =>
  Math.ceil(products.value.length / perPage.value)
);
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return products.value.slice(start, start + perPage.value);
});

// Modal control
const showProductDetails = (product) => {
  selectedProduct.value = product;
  isDetailsModalOpen.value = true;

  // console.log(Array(product.SW_Images));

  let images = product?.SW_Images;
  if (typeof images === "string") {
    images = images.split(",");
    // console.log("SW_Images was a string, so we split it into an array.");
  }
  imageObjects.value = images.map((image) => ({ image }));
};

const closeDetailsModal = () => {
  isDetailsModalOpen.value = false;
  selectedProduct.value = {};
};

const openAddModal = () => {
  currentProduct.value = {};
  isAddModalOpen.value = true;
  isModalOpen.value = true;
};

const openEditModal = (product) => {
  currentProduct.value = { ...product };
  isAddModalOpen.value = false;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  isAddModalOpen.value = false;
  currentProduct.value = {};
  name.value = "";
  price.value = 0;
  category.value = "";
  image.value = null;
};

const confirmDelete = (productId) => {
  userIdToDelete.value = productId;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  userIdToDelete.value = null;
};

// Update product
const updateProduct = async () => {
  try {
    await axios.put(
      `/product/${currentProduct.value.SW_Id}`,
      currentProduct.value
    );
    const index = products.value.findIndex(
      (product) => product.SW_Id === currentProduct.value.SW_Id
    );
    if (index !== -1) {
      products.value.splice(index, 1, currentProduct.value);
    }
    successMessage.value = "Product updated successfully!";
    isSuccessModalVisible.value = true;
    closeModal();
    setTimeout(() => {
      isSuccessModalVisible.value = false;
      window.location.reload();
    }, 2000);
  } catch (error) {
    errorMessage.value = "Failed to update product. Please try again.";
    console.error("Error updating product:", error);
    isErrorModalVisible.value = true; // Show error modal
  }
};

// Delete product
const deleteProduct = async (productId) => {
  try {
    await axios.delete(`/product/${productId}`);
    products.value = products.value.filter(
      (product) => product.SW_Id !== productId
    );
    successMessage.value = "Product deleted successfully!";
    isSuccessModalVisible.value = true;
    closeDeleteModal();
    setTimeout(() => {
      isSuccessModalVisible.value = false;
      window.location.reload();
    }, 2000);
  } catch (error) {
    errorMessage.value = "Failed to delete product. Please try again.";
    console.error("Error deleting product:", error);
    isErrorModalVisible.value = true; // Show error modal
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
onMounted(fetchProducts);
</script>

<style scoped></style>
