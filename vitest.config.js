import { svelte } from '@sveltejs/vite-plugin-svelte'
import solidPlugin from 'vite-plugin-solid'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [solidPlugin(), svelte()],
  test: {
    environment: 'jsdom',
  },
})
