/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      heading: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0f0e17',
          light: '#fffffe',
        },
        surface: {
          DEFAULT: '#1a1a2e',
          light: '#f4f4f8',
        },
        accent: {
          DEFAULT: '#f5a623',
          secondary: '#e0a458',
        },
        heading: {
          DEFAULT: '#fffffe',
          light: '#0f0e17',
        },
        body: {
          DEFAULT: '#a7a9be',
          light: '#4a4a68',
        },
        muted: '#4a4a68',
      },
    },
  },
  plugins: [],
}
