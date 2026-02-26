import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  Link,
} from "react-router";
import type { Route } from "./+types/root";
import { Landscape } from "~/components/landscape";

import "./app.css";

export const meta: Route.MetaFunction = () => [
  { title: "cristian" },
  { name: "description", content: "Building things with care." },
  { property: "og:title", content: "cristian" },
  { property: "og:description", content: "Building things with care." },
  { property: "og:url", content: "https://cvr.im" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary" },
  { name: "twitter:title", content: "cristian" },
  { name: "twitter:description", content: "Building things with care." },
];

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
  { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "canonical", href: "https://cvr.im" },
  { rel: "alternate", type: "application/rss+xml", title: "cristian", href: "https://cvr.im/blog/rss.xml" },
];

/**
 * Inline script to prevent flash of wrong theme.
 * Reads from localStorage, falls back to system preference.
 */
const themeScript = `
  (function() {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f5f7fa" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e2240" media="(prefers-color-scheme: dark)" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const title = is404 ? "not found" : "something went wrong";
  const message = is404
    ? "this page doesn\u2019t exist."
    : isRouteErrorResponse(error)
      ? error.data
      : error instanceof Error
        ? error.message
        : "Unknown error";

  return (
    <div className="relative flex min-h-dvh flex-col items-center px-6 pt-28 pb-16 sm:pt-40">
      <Landscape />
      <main className="relative w-full max-w-[60ch]">
        <h1 className="text-2xl font-medium tracking-tight text-balance">
          {title}
        </h1>
        <p className="mt-3 text-muted-foreground">{message}</p>
        <Link
          to="/"
          className="-mx-2 mt-6 inline-block rounded-md px-2 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; home
        </Link>
      </main>
    </div>
  );
}
