<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import io from "socket.io-client";
import axios from "axios";
import { relativeTime } from "../composables/relativeTime";

const id = ref(localStorage.getItem("seller_id") ||  localStorage.getItem("buyer_id"));
const name = ref(localStorage.getItem("seller_fullname") || localStorage.getItem("buyer_fullname"));
const status = ref(localStorage.getItem("statusMode") || localStorage.getItem("buyer_statusMode"));

const scrollContainer = ref(null);
const requiredInput = ref("");
const closeChat = () => {
  localStorage.removeItem("seller_id");
  localStorage.removeItem("seller_fullname");
  localStorage.removeItem("statusMode");
  localStorage.removeItem("buyer_id");
  localStorage.removeItem("buyer_fullname");
  localStorage.removeItem("buyer_statusMode");
  id.value = "";
  name.value = "";
  status.value = "";
  isTyping.value = false;
  userIndicator.value = "";
};
const userId = ref(localStorage.getItem("Id"));
// chat
const messageInput = ref("");
const messages = ref([]);
const isTyping = ref(false); // Track if the other user is typing
const typingTimeout = ref(null); // Timer to handle typing stop
const socket = io("http://192.168.1.6:4001");

const fetchMessages = async () => {
  if (id.value) {
    try {
      const response = await axios.get(
        `http://192.168.1.6:4001/api/chats/${localStorage.getItem("Id")}/${
          id.value
        }`
      );
      messages.value = response.data;
      scroolToBottom();
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  }
};

const sendMessage = async (user1, user2) => {

  const message = {
    user_1: user1,
    user_2: user2,
    text: messageInput.value,
  };
  try {
    await axios.post("http://192.168.1.6:4001/api/chats", message);
    messageInput.value = "";
    fetchMessages();
    scroolToBottom();
  } catch (error) {
    if (error.response) {
      requiredInput.value = error.response.data.data;
    }
  }
};

// Emit typing event when typing
const onTyping = () => {
  socket.emit("typing", {
    user_1: localStorage.getItem("Id"),
    user_2: id.value,
    fullname: localStorage.getItem("name"),
  });
  clearTimeout(typingTimeout.value); // Clear previous timer
  typingTimeout.value = setTimeout(() => {
    socket.emit("stopTyping", {
      user_1: localStorage.getItem("Id"),
      user_2: id.value,
      fullname: localStorage.getItem("name"),
    });
  }, 3000); // Stops typing after 3 seconds of inactivity
};

// Listen for "message", "typing", and "stopTyping" events
socket.on("message", (message) => {
  if (
    (message.user_1 === localStorage.getItem("Id") &&
      message.user_2 === id.value) ||
    (message.user_1 === id.value &&
      message.user_2 === localStorage.getItem("Id"))
  ) {
    messages.value.push(message);
    fetchMessages();
    scroolToBottom();
  }
});
const userIndicator = ref();

socket.on("typing", (data) => {
  if (
    (data.user_1 === localStorage.getItem("Id") && data.user_2 === id.value) ||
    (data.user_1 === id.value && data.user_2 === localStorage.getItem("Id"))
  ) {
    isTyping.value = true;
    userIndicator.value = data.fullname;
  }
});

socket.on("stopTyping", (data) => {
  if (
    (data.user_1 === localStorage.getItem("Id") && data.user_2 === id.value) ||
    (data.user_1 === id.value && data.user_2 === localStorage.getItem("Id"))
  ) {
    isTyping.value = false;
    userIndicator.value = "";
  }
});

const scroolToBottom = async () => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
};

watch(id, (newId) => {
  if (newId) {
    isTyping.value = false;
    userIndicator.value = "";
    fetchMessages();
    scroolToBottom();
  }
});
const role =localStorage.getItem("role");
onMounted(() => {
  fetchMessages();
  scroolToBottom();
  if (!id && !name && !status) {
    console.log("Container is not provided!");
  }
});
</script>

<template>
  <main>
    <section
      v-if="id"
      class="slide-in border z-50 rounded-t-lg fixed right-0 md:right-4 lg:right-[50px] xl:right-32 bg-white w-full md:w-1/3 lg:w-1/3 xl:w-1/3" :class="role=='buyer'? 'bottom-12 md:bottom-0 lg:bottom-0 xl:bottom-0':'bottom-0'"
    >
      <div class="w-full flex justify-between items-center border-b px-4">
        <p
          class="p-1 rounded-full"
          :class="status === 'online' ? 'bg-blue-500 ' : ''"
        ></p>
        <p class="outfit-header text-gray-600">{{ name }}</p>
        <svg
          @click="closeChat"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 my-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>

      <!-- Message container -->
      <div
        ref="scrollContainer"
        class="w-full py-6 px-4 element-with-horizontal-scroll"
        style="max-height: 420px; overflow-y: auto; height: 53vh"
      >
        <ul
          class="my-2 toast-animation-in"
          v-for="(message, index) in messages"
          :key="index"
        >
          <div v-if="message.name !== name">
            <p class="my-2"><small class="mr-2 text-gray-400">You </small></p>
            <span
              :class="{ 'bg-gray-900': message.text }"
              class="p-2 text-white my-2 rounded-lg"
              v-html="message.text"
            ></span>
            <small class="inline-block w-full my-1">{{
              relativeTime(message.created_at)
            }}</small>
          </div>

          <div v-if="message.name === name" class="text-right">
            <p class="my-2">
              <small class="text-gray-400">{{ message.name }}</small>
            </p>
            <span
              :class="{ 'bg-gray-900': message.text }"
              class="p-2 text-white my-2 rounded-lg"
              v-html="message.text"
            ></span>
            <small class="inline-block w-full my-1">{{
              relativeTime(message.created_at)
            }}</small>
          </div>
        </ul>

        <!-- Display typing indicator -->
        <p v-if="isTyping" class="text-gray-500 italic px-4">
          {{ userIndicator }} typing...
        </p>
      </div>

      <div class="mx-auto sticky left-0 w-full bottom-0 pb-6 bg-white px-4">
        <div class="flex">
          <input
            v-model="messageInput"
            @input="onTyping"
            type="text"
            :class="requiredInput !== '' ? 'border border-red-500' : ''"
            class="text-black px-2 py-3 outline-none rounded w-full bg-gray-100"
            placeholder="Type your message"
          />
          <button
            @click="sendMessage(userId, id)"
            class="text-white bg-gradient-to-r from-gray-900 to-gray-900 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  </main>
</template>