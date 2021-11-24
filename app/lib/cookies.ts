import { createCookie } from "remix";

export type Theme = "light" | "dark";

export let themeCookie = createCookie("theme", {
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
});

export let getTheme = async (request: Request) => {
  let value = await themeCookie.parse(request.headers.get("cookie"));
  return value?.theme ?? null;
};

export let setTheme = async (request: Request) => {
  let value = await themeCookie.parse(request.headers.get("cookie"));
  let params = await request.formData();
  value.theme = params.get("theme") ?? value.theme ?? null;
  return value;
};
