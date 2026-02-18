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
        // Figma mockup uses different blue
        // "ucsd-blue": "#00629B",
        "ucsd-blue": "#0E7395",
        "ucsd-darkblue": "#182B49",
        // Figma mockup uses different gold
        // "ucsd-gold": "#FFCD00",
        "ucsd-gold": "#F6AE2D",
      },
      fontFamily: {
        jetbrains: ["JetBrains Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
