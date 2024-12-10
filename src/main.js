import './css/main.css';
import './css/global.css';
import "vue-toastification/dist/index.css";
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import Toast, { POSITION } from 'vue-toastification';

const app = createApp(App);

// app.use(Toast, {
//   position: POSITION.BOTTOM_RIGHT, 
//   timeout: 1000,
// });

function getToastPosition() {
  return window.innerWidth < 768 ? POSITION.TOP_CENTER : POSITION.BOTTOM_RIGHT;
}

app.use(Toast, {
  position: getToastPosition(), 
  timeout: 1000,
});

window.addEventListener("resize", () => {
  const newPosition = getToastPosition();
  Toast.updateDefaults({
    position: newPosition,
  });
});
app.use(createPinia());
app.use(router);

app.mount('#app');
