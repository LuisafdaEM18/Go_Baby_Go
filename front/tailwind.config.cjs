/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'corporate-primary': '#1e3766',
        'corporate-secondary': '#73a31d',
      },
    },
  },
  plugins: [],
} 