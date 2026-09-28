import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        // Utilisation du plugin babel-plugin-react-compiler pour optimiser le rendu des composants React
        // https://react.dev/learn/react-compiler
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    // Utilisation de tailwindcss pour les styles
    // https://tailwindcss.com/docs/installation/using-vite
    tailwindcss(),
  ],
})
