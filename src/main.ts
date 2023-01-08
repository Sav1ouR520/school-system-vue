import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import "animate.css"
import "uno.css"
import "normalize.css"
import "@/assets/css/main.css"
const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.use(router)
app.mount("#app")
