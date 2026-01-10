import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const isProd =process.env.NODE_ENV ==='production'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: isProd? '/GitHub_Commit_Explorer/': '/'
})
