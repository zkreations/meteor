import { defineConfig } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [solidPlugin(), svelte()],
  test: {
    environment: 'jsdom'
  }
})
