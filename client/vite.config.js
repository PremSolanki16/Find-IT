import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Tailwind utilities are available alongside the existing component styles.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
