<script setup>
import Close from '@/assets/icons/close.vue';
import axios from '../../axios';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Back from '@/assets/icons/back.vue';

const router = useRouter();
const showModal = ref(false);
const showModalOtp = ref(false);
const successModal = ref(false);
const errorModal = reactive({ show: false, message: '' });
const termsAndCondition = ref(false)
// const TermsBuyer = 'This is a terms for buyer';
const TermsBuyer = {
  content: `<div class="p-4 bg-gray-100 text-gray-800 overflow-auto max-h-[500px]">
    <h1 class="text-2xl font-bold text-red-300 mb-4">Welcome</h1>
    <p>To Street Wear dear Customer! By using our app, you agree to the following terms:</p>
    
    <h2 class="text-xl font-semibold mt-6 mb-2">Acceptance of Terms</h2>
    <p>
        By accessing Street Wear, you accept these terms. If you disagree, do not use the app. We may update these terms periodically; changes will be posted here, and it's your responsibility to review them.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Account Creation</h2>
    <p>
        To access certain features, you must create an account and agree to provide accurate information, secure your password, and notify us of unauthorized use.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">User Responsibilities</h2>
    <p>
        Use Street Wear only for lawful purposes; you must not violate any laws, introduce malware, or attempt unauthorized access.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Ownership and Liability</h2>
    <p>
        All content and features are owned by Street Wear and protected by law. Street Wear is not liable for any damages arising from your use of the app. You agree to indemnify Street Wear against any claims arising from your use of the app.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Governing Law</h2>
    <p>
        These terms are governed by the laws of the Philippines. For questions, contact us at <a href="mailto:contact@streetwear.com" class="text-blue-500 underline">@StreetWear</a>.
    </p>

    <p class="mt-4">
        By using Street Wear, you acknowledge that you have read and agree to these terms.
    </p>
</div>
`
};


const TermsSeller = {
  content: ` <div class="p-4 bg-gray-100 text-gray-800 overflow-auto max-h-[500px]">
    <h1 class="text-2xl font-bold text-red-300 mb-4">Welcome to Street Wear!</h1>
    <p>By using our app as a seller, you agree to the following terms:</p>
    
    <h2 class="text-xl font-semibold mt-6 mb-2">Acceptance of Terms</h2>
    <p>
      By accessing Street Wear, you accept these terms. If you disagree, do not use the app. We may update these terms periodically; changes will be posted here, and it's your responsibility to review them.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Account Creation</h2>
    <p>
      To use seller features, you must create an account and agree to provide accurate information, maintain the security of your account, and notify us of any unauthorized use.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Seller Responsibilities</h2>
    <p>
      You agree to sell only legitimate products and comply with all applicable laws. You must not introduce malware or attempt unauthorized access to the app or user accounts.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Ownership and Liability</h2>
    <p>
      All content and features are owned by <strong>Streetwear</strong> and protected by law. <strong>Streetwear</strong> is not liable for any damages arising from your use of the app. You agree to indemnify <strong>Streetwear</strong> against any claims arising from your use of the app.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Governing Law</h2>
    <p>
      These terms are governed by the laws of <strong>Philippines</strong>. For questions, contact us at <strong>@StreetwearOfficialStore</strong>.
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">Courier Requirement</h2>
    <p>You have to have your own courier that can deliver from place to place:</p>

    <p class="mt-4">
      By using Street Wear, you acknowledge that you have read and agree to these terms.
    </p>
  </div>`
};

const emit = defineEmits(["gotoLogin"])
const animationOut = ref(false)
const gotoLogin = () => {
  animationOut.value = true;
  emit('gotoLogin');
};
const hasOwnCourier = ref(false)
const seller = ref(false);
const condition = ref(false);

const changeForm = () => {
  seller.value = !seller.value;
  formData.role = seller.value ? 'seller' : 'buyer';
};

const formData = reactive({
  name: '',
  password: '',
  email: '',
  otp: '',
  birthdate: '',
  role: 'buyer',
});

// const localHost = 'http://localhost:8080';

const createAccount = async () => {
  try {
    await axios.post(`/user/registration`, formData);

    // Success alert using SweetAlert
    await Swal.fire({
      title: 'Success!',
      text: 'Your account has been created.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });

    // Reset formData properties
    Object.keys(formData).forEach(key => formData[key] = '');
    formData.role = 'buyer';

    gotoLogin(); // Call to navigate to the login page after the alert

  } catch (error) {
    console.log("error", error.response?.data?.message);

    // Error alert using SweetAlert
    const errorMessage = error.response?.data?.message || "Error processing data";
    await Swal.fire({
      title: 'Error!',
      text: errorMessage,
      icon: 'error',
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

const sendOtp = async () => {
  try {
    await axios.post(`/user/otp`, { email: formData.email });
    showModalOtp.value = true;
    setTimeout(() => {
      showModalOtp.value = false;
    }, 1500);
  } catch (error) {
    errorModal.message = error.response?.data?.message || 'An error occurred while sending the OTP.';
    errorModal.show = true;
    setTimeout(() => {
      errorModal.show = false;
    }, 1500);
  }
};

onMounted(() => {
  document.body.style.overflow = 'hidden';
})
</script>


<template>
  <div
    class="fixed top-0 left-0 bottom-0 w-full h-full flex items-center justify-center min-h-screen bg-background bg-opacity-0 backdrop-blur-md signup-animation-in z-20"
    :class="animationOut == true ? 'toast-animation-out' : ''">
    <span class="fixed top-0 left-0 w-full h-full z-10" @click="gotoLogin"></span>

    <div class="bg-card bg-black p-6 rounded-lg shadow-md sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 z-40">
      <h2 class="text-2xl font-bold text-slate-50 text-center ">
        {{ seller ? 'SELLER' : 'BUYER' }} FORM
      </h2>
      <form @submit.prevent="createAccount" class="sm:flex md:flex lg:flex xl:flex gap-4 justify-center">
        <div>
          <div>
            <label class="block text-slate-50 mb-1" for="name">NAME</label>
            <input v-model="formData.name" class="w-full p-2 border border-border rounded" type="text" id="name"
              placeholder="Enter your name" required aria-required="true" />
          </div>
          <div>
            <label class="block text-slate-50 mb-1" for="password">PASSWORD</label>
            <input v-model="formData.password" class="w-full p-2 border border-border rounded" type="password"
              id="password" placeholder="Enter your password" required aria-required="true" @focus="showModal = true"
              @blur="showModal = false" />
          </div>

          <!-- Modal -->
          <div v-if="showModal" class="fixed flex"
            @click.self="showModal = false">
            <div class="bg-white p-4 rounded shadow-md">
              <div class="flex justify-between items-center">
                <h3 class="text-sm font-semibold">Password Requirements</h3>
              </div>
              <ul class="mt-2 text-xs">
                <li>Enter a combination of at least six numbers, letters, and punctuation marks (like ! and &)</li>
              </ul>
            </div>
          </div>

          <div>
            <label class="block text-slate-50 mb-1" for="email">EMAIL</label>
            <input v-model="formData.email" class="w-full p-2 border border-border rounded" type="email" id="email"
              placeholder="Enter your email" required aria-required="true" />
          </div>
          <div>
            <label class="block text-slate-50 mb-1" for="otp">OTP</label>
            <input v-model="formData.otp" class="w-full p-2 border border-border rounded" type="text" id="otp"
              placeholder="One Time Password" />
            <button @click.prevent="sendOtp"
              class="bg-lime-500 text-neutral-950 hover:bg-primary/80 mt-4 p-2 rounded-lg" type="button">
              SEND OTP
            </button>
          </div>
        </div>

        <div>
          <div>
            <label class="block text-slate-50 mb-1" for="birthdate">DATE OF BIRTH</label>
            <input v-model="formData.birthdate" class="w-full p-2 border border-border rounded" type="date"
              id="birthdate" />
          </div>
          <button class="mt-6 bg-lime-500 text-neutral-950 hover:bg-primary/80 w-full p-2 rounded-lg" type="submit">
            Create Account
          </button>
          <div class="text-white p-2 flex justify-center">
            <input type="checkbox" v-model="termsAndCondition" class="mx-2" required aria-required="true">
            <span class="text-white underline cursor-pointer" @click="condition = !condition">Please Read Terms And
              Conditions</span>
          </div>
          <div class="text-white p-2 flex justify-center" v-if="seller">
            <input type="checkbox" class="mx-2" required aria-required="true">
            <span class="text-white underline cursor-pointer">Do you have a courier?</span>
          </div>
          <p class="text-slate-50 flex p-2 underline justify-center cursor-pointer" @click="changeForm">
            I want to be a {{ seller ? 'Buyer' : 'Seller' }}
          </p>
        </div>
      </form>
    </div>

    <button
      class="fixed text-white top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-md shadow-md transition-all duration-200 ease-in-out z-50"
      @click="gotoLogin">
      <Back/>
    </button>

    <!-- Modal for OTP sent confirmation -->
    <div v-if="showModalOtp" class="fixed bottom-0 right-0 m-6 bg-gray-800 text-white p-4 rounded shadow-lg">
      <p>An OTP has been sent to your email.</p>
    </div>

    <div v-if="successModal" class="fixed bottom-0 right-0 m-6 bg-green-500 text-white p-4 rounded shadow-lg">
      <p>Account Successfully Created, Welcome to STREETWEAR.</p>
    </div>

    <div v-if="condition" role="dialog" aria-labelledby="modal-title" aria-modal="true"
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm sm:max-w-md md:max-w-lg w-full">
        <h2 id="modal-title" class="text-xl font-semibold ">Terms and Conditions</h2>
        <p v-if="seller" v-html="TermsSeller.content"></p>
        <p v-if="!seller" v-html="TermsBuyer.content"></p>
        <button class="bg-lime-500 text-neutral-950 hover:bg-primary/80 w-full p-2 rounded-lg mt-4"
          @click="condition = false">Close</button>
      </div>
      
    </div>

    <div v-if="errorModal.show" class="fixed bottom-0 right-0 m-6 bg-red-600 text-white p-4 rounded-lg shadow-lg">
      <p>{{ errorModal.message }}</p>
    </div>
  </div>
</template>
