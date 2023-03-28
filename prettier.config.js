module.exports = {
  plugins: [require("@trivago/prettier-plugin-sort-imports"), require("prettier-plugin-tailwindcss")],
  printWidth: 120,
  singleQuote: false,
  trailingComma: "all",
  importOrder: ["^~/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
