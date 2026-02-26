import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";

import "./app.css";

export const meta: Route.MetaFunction = () => [
  { title: "cristian" },
  { name: "description", content: "Building things with care." },
  { property: "og:title", content: "cristian" },
  { property: "og:description", content: "Building things with care." },
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
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {error.status} {error.statusText}
          </h1>
          <p className="mt-2 text-muted-foreground">{error.data}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    </div>
  );
}
