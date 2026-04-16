module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#f5f7f9",
          100: "#eceff3",
          200: "#d9dfe7",
          300: "#c6cedb",
          400: "#b3bdcf",
          500: "#a0acc3",
          600: "#1d3557",
          700: "#0d1b2a",
          800: "#0a1428",
          900: "#070d1a",
        },
        bg: {
          50:  "#faf8f6",
          100: "#f8f4f0",
          200: "#f0ebe6",
          300: "#e8e2dc",
          400: "#e0d9d2",
          500: "#d8d0c8",
          600: "#d0c8c0",
          700: "#c8c0b8",
          800: "#c0b8b0",
          900: "#a89880",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
