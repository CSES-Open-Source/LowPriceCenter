/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'ucsd-blue': '#00629B',
        'ucsd-darkblue': '#182B49',
      },
    },
  },
  plugins: [],
};
