/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xl: "1100px",
        xxl: "1300px",
      },
      colors: {
        "ucsd-blue": "#00629B",
        "ucsd-darkblue": "#182B49",
        "ucsd-gold": "#FFCD00",
      },
      fontFamily: {
        jetbrains: ["JetBrains Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
