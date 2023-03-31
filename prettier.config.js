module.exports = {
  plugins: [require("prettier-plugin-tailwindcss"), require("./node_modules/@ianvs/prettier-plugin-sort-imports")],
  printWidth: 120,
  singleQuote: false,
  trailingComma: "all",
  importOrder: ["^~/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCombineTypeAndValueImports: false,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderMergeDuplicateImports: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
};
