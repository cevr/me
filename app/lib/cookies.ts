import { createCookie } from "remix";

export let colorModeCookie = createCookie("colorMode", {
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
});
