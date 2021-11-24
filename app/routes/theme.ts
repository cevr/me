import { ActionFunction } from "remix";
import { redirectBack } from "remix-utils";
import { themeCookie, setTheme } from "~/lib";

export let action: ActionFunction = async ({ request }) => {
  let cookie = await setTheme(request);
  return redirectBack(request, {
    fallback: "/",
    headers: {
      "Set-Cookie": (await themeCookie.serialize(cookie)) as any,
    },
  });
};
