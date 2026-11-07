import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Bundle React Router into the SSR entry instead of letting Vercel trace
// conditional package exports. The development export may be missing from
// the serverless function otherwise.
export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['react-router', 'react-router-dom'],
  },
})
