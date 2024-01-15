import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { store, storeInjectionKey } from "./store";

const app = createApp(App);
app.use(store, storeInjectionKey);
app.mount("#app");
