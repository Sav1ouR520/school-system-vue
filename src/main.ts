import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import "@unocss/reset/tailwind.css"
import "animate.css"
import "uno.css"
import "@/assets/css/style.css"
import VueCropper from "vue-cropper"
import "vue-cropper/dist/index.css"
// document.onselectstart = () => false

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(VueCropper)
app.use(pinia)
app.use(router)
app.mount("#app")
