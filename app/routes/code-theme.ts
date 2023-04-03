import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { setTheme, themeCookie } from "~/lib";

export let action: ActionFunction = async ({ request }) => {
  let cookie = await setTheme(request);
  return redirect(request.headers.get("Referer") ?? "/", {
    headers: {
      "Set-Cookie": (await themeCookie.serialize(cookie)) as any,
    },
  });
};

// let light = `:root {
//   --code-bg: #e9ecef;
//   --code-highlight-bg: #0b728520;
//   --code-comment: #868e96;
//   --code-keyword: #0b7285;
//   --code-string: #d77b6a;
//   --code-punc: #212529;
//   --code-func: #dd4a68;

//   --bg: #f8f9fa;
//   --fg: #212529;
//   --link-bg: #e9ecef;
//   --link-hover-fg: #f8f9fa;
//   --accent: #495057;
//   --highlight: #0b7285;
//   --contrast: salmon;
// }`;

export let loader: LoaderFunction = async ({ request }) => {
  // const theme = await getTheme(request);
  // no theme for now

  return new Response(
    `:root {
        --code-bg: #1c1e26;
        --code-highlight-bg: #fa807220;
        --code-comment: #868e96;
        --code-keyword: var(--salmon-500);
        --code-string: #fac29a;
        --code-punc: #999999;
        --code-func: #dd4a68;
      }`,
    { headers: { "content-type": "text/css" } },
  );
};
