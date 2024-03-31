module.exports = {
  printWidth: 120,
  singleQuote: false,
  trailingComma: "all",
  // Since prettier 3.0, manually specifying plugins is required
  plugins: ["prettier-plugin-tailwindcss", "@ianvs/prettier-plugin-sort-imports"],
  // This plugin's options
  importOrder: ["<BUILTIN_MODULES>", "", "<THIRD_PARTY_MODULES>", "", "^~/(.*)$", "", "^[./]"],
};
