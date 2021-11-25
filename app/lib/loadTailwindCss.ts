import postcss from "postcss";
import tailwindcss from "tailwindcss";

let cachedCss: string | undefined;

export let loadTailwindCss = async () => {
  if (cachedCss) {
    return cachedCss;
  }
  const { css } = await postcss(tailwindcss).process(`
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  `);

  cachedCss = css;
  return css
  ;
}
