import { ActionFunction, redirect } from "remix";
import { themeCookie, setTheme } from "~/lib";

export let action: ActionFunction = async ({ request }) => {
  let cookie = await setTheme(request);
  return redirect(request.headers.get("Referer") ?? '/', {
    headers: {
      "Set-Cookie": (await themeCookie.serialize(cookie)) as any,
    },
  });
};
