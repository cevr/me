/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        salmon: {
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
        ocean: {
          50: "#e5f6f9",
          100: "#ccecf4",
          200: "#99d6e8",
          300: "#66c1dc",
          400: "#33abd1",
          500: "#0b7285",
          600: "#085f6e",
          700: "#064c58",
          800: "#043942",
          900: "#02262b",
          950: "#01141a",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = "") {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];
          const cssVariable = colorKey === "DEFAULT" ? `--${colorGroup}` : `--${colorGroup}-${colorKey}`;

          const newVars =
            typeof value === "string" ? { [cssVariable]: value } : extractColorVars(value, `${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ":root": extractColorVars(theme("colors")),
      });
    },
  ],
};
