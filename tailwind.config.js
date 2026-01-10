/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        primary: '#6366f1', // Indigo
        secondary: '#8b5cf6', // Purple
        accent: '#ec4899', // Pink
        lightBg: '#f8fafc', // Very light blue-gray
        cardBg: '#ffffff',
      },
    },
  },
  plugins: [],
}
