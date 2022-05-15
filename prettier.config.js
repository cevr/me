module.exports = {
  plugins: [require("@trivago/prettier-plugin-sort-imports")],
  printWidth: 120,
  singleQuote: false,
  trailingComma: "all",
  importOrder: ["^~/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
