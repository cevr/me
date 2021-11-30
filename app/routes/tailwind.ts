import { loadTailwindCss } from "~/lib";

export let loader = async () => {
  let css = await loadTailwindCss();
  return new Response(css, {
    headers: {
      "content-type": "text/css",
      "cache-control": "max-age=31536000",
    },
  });
};
