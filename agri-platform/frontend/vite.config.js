import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // bind to all network interfaces (works reliably across environments)
    host: '0.0.0.0',
    // ensure PORT is treated as a number when provided by the environment
    port: Number(process.env.PORT) || 5173,
    // let Vite fail if the requested port is in use (Render expects the assigned port)
    strictPort: true,
  },
  // preview options used by `vite preview` (serve built files)
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
  },
})
