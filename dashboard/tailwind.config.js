/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trading: {
          bg: '#0a0e1a',
          card: '#111827',
          border: '#1f2937',
          accent: '#3b82f6',
          success: '#22c55e',
          danger: '#ef4444',
          warning: '#f59e0b',
          text: '#e5e7eb',
          muted: '#9ca3af'
        }
      }
    },
  },
  plugins: [],
}