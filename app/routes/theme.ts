import { ActionFunction, LoaderFunction, redirect } from "remix";
import { themeCookie, setTheme, getTheme } from "~/lib";

export let action: ActionFunction = async ({ request }) => {
  let cookie = await setTheme(request);
  return redirect(request.headers.get("Referer") ?? "/", {
    headers: {
      "Set-Cookie": (await themeCookie.serialize(cookie)) as any,
    },
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  const theme = await getTheme(request);

  return new Response(
    theme === "light"
      ? `:root {
    --code-bg: #e9ecef;
    --code-highlight-bg: #0b728520;
    --code-comment: #868e96;
    --code-keyword: #0b7285;
    --code-string: #d77b6a;
    --code-punc: #212529;
    --code-func: #dd4a68;
  
    --bg: #f8f9fa;
    --fg: #212529;
    --link-bg: #e9ecef;
    --link-hover-fg: #f8f9fa;
    --accent: #495057;
    --highlight: #0b7285;
    --contrast: salmon;
  }`
      : `:root {
        --code-bg: #1c1e26;
        --code-highlight-bg: #fa807220;
        --code-comment: #868e96;
        --code-keyword: salmon;
        --code-string: #fac29a;
        --code-punc: #999999;
        --code-func: #dd4a68;
      
        --bg: #212529;
        --fg: #f8f9fa;
        --link-bg: #343a40;
        --link-hover-fg: #212529;
        --accent: #adb5bd;
        --highlight: salmon;
        --contrast: #0b7285;
      }`,
    { headers: { "content-type": "text/css" } }
  );
};
