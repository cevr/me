import "./styles/root.css";

import type { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useMatches,
  useRouteError,
} from "@remix-run/react";

export let links: LinksFunction = () => {
  return [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    {
      rel: "manifest",
      href: "/manifest.json",
    },
  ];
};

export default function App() {
  const matches = useMatches();

  const noscript = matches.some((match) => (match.handle as Record<string, any> | undefined)?.noscript);

  return (
    <Document noscript={noscript}>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 401:
      case 404:
        return (
          <Document title="Not found | Cristian">
            <main
              style={{
                gridArea: "content",
              }}
              className="grid h-full place-items-center text-center text-lg leading-8 text-neutral-500 duration-200"
            >
              <div>
                <p>Nope! This page definitely doesn't exist. Just checked.</p>
                <p>
                  Take this{" "}
                  <Link
                    to="/"
                    className="border-b-[3px] border-salmon-500 text-salmon-500 duration-200"
                    aria-label="home link"
                  >
                    link
                  </Link>{" "}
                  back home
                </p>
              </div>
            </main>
          </Document>
        );

      default:
        return (
          <Document title="Oops! | Cristian">
            <main
              style={{
                gridArea: "content",
              }}
            >
              <div>
                <p>What??! Something went wrong you say?</p>
                <p>
                  Click this{" "}
                  <Link to="/" className="border-b-3 duration-200" aria-label="home link">
                    link
                  </Link>{" "}
                  back home and pretend you never saw anything.
                </p>
              </div>
            </main>
          </Document>
        );
    }
  }

  return (
    <Document title="Oops! | Cristian">
      <main
        style={{
          gridArea: "content",
        }}
      >
        <div>
          <p>What??! Something went wrong you say?</p>
          <p>
            Click this{" "}
            <Link to="/" className="border-b-3 duration-200" aria-label="home link">
              link
            </Link>{" "}
            back home and pretend you never saw anything.
          </p>
        </div>
      </main>
    </Document>
  );
}

function Document({ children, title, noscript }: { children: React.ReactNode; title?: string; noscript?: boolean }) {
  return (
    <html lang="en" className="dark h-full ml-[calc(100vw_-_100%)]">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body
        className="h-full w-full bg-neutral-900 text-neutral-50"
        style={{
          scrollbarGutter: "stable both-edges",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateAreas: `"nav"
    "content"
    "footer"`,
            gridTemplateRows: "auto 1fr auto",
          }}
          className="m-auto h-full min-h-0 max-w-[100vw] p-4 md:max-w-[1200px] gap-12"
        >
          {children}
        </div>
        {!noscript ? <Scripts /> : null}
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
