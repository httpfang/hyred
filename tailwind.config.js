/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'sans': ['Inter', 'ui-sans-serif', 'system-ui']
        }
      },
    },
    plugins: [],
  }