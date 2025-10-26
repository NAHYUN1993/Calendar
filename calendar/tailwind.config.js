/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'rich-black': '#0D0D0D',
        brand: {
          50: '#f0f9f9',
          100: '#ddeeee',
          200: '#badcdd',
          300: '#97cbcc',
          400: '#73babb',
          500: '#50a9ab',
          600: '#359a9b',
          700: '#2f8687',
          800: '#286f70',
          900: '#235b5c',
          950: '#173c3d',
        },
      }
    }
  },
  plugins: [],
}
