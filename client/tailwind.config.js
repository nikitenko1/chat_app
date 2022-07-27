/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        bounce: 'bounce 5s infinite',
      },
    },
  },
  plugins: [],
};
