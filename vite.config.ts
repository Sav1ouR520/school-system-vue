import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueSetupExtend from "vite-plugin-vue-setup-extend"

import Icons from "unplugin-icons/vite"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import IconsResolver from "unplugin-icons/resolver"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import { presetUno, presetAttributify, presetIcons } from "unocss"
import unocss from "unocss/vite"
import electron from "vite-plugin-electron"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: { "/api": "http://localhost:3000" },
  },
  plugins: [
    AutoImport({
      imports: ["vue", "@vueuse/core", "vue-router"],
      dts: "src/types/auto-import.d.ts",
      resolvers: [ElementPlusResolver(), IconsResolver()],
    }),
    Components({
      dts: "src/types/components.d.ts",
      deep: true,
      dirs: ["src/components"],
      resolvers: [IconsResolver({ enabledCollections: ["ep", "ic", "carbon"] }), ElementPlusResolver()],
    }),
    Icons({
      compiler: "vue3",
      autoInstall: true,
    }),
    vue(),
    vueSetupExtend(),
    unocss({ presets: [presetUno(), presetAttributify(), presetIcons()] }),
    // electron({ entry: "src/electron/index.ts" }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
