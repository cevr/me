import { createCookie } from '@remix-run/node';

export type Theme = 'light' | 'dark';

export let themeCookie = createCookie('theme', {
  maxAge: 60 * 60 * 24 * 365,
  path: '/',
});

export let getTheme = async (request: Request): Promise<Theme> => {
  let cookie = (await themeCookie.parse(request.headers.get('cookie'))) ?? {
    theme: 'dark',
  };
  return cookie?.theme;
};

export let setTheme = async (request: Request) => {
  let cookie = (await themeCookie.parse(request.headers.get('cookie'))) ?? {};
  let params = await request.formData();
  cookie.theme = params.get('theme') ?? cookie.theme ?? 'dark';
  return cookie;
};
