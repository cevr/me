/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFF5F5",
          100: "#FFE6E6",
          200: "#FFC9C9",
          300: "#FFA9A9",
          400: "#FF8989",
          500: "#FA8072",
          600: "#E47066",
          700: "#C9605A",
          800: "#AD504E",
          900: "#924042",
          950: "#5B2828",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
