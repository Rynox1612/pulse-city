/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#3b82f6', // Medical Blue
          600: '#2563eb',
          700: '#1d4ed8',
        },
        emergency: {
          50: '#fef2f2',
          500: '#ef4444', // Alert Red
          600: '#dc2626',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
