import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Link, Links, LiveReload, Meta, Outlet, Scripts, useCatch, useMatches } from "@remix-run/react";

import rootStyles from "./styles/root.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";

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
    {
      rel: "stylesheet",
      href: tailwindStylesheetUrl,
    },
    {
      rel: "stylesheet",
      href: "/theme",
    },
    { rel: "stylesheet", href: rootStyles },
  ];
};

export let meta: MetaFunction = () => {
  return {
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  };
};

export default function App() {
  const matches = useMatches();

  const noscript = matches.some((match) => match.handle?.noscript);

  return (
    <Document noscript={noscript}>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 404:
      return (
        <Document title="Not found | Cristian">
          <main
            style={{
              gridArea: "content",
            }}
            className="grid h-full place-items-center text-center text-lg leading-8 text-[var(--accent)] duration-200"
          >
            <div>
              <p>Nope! This page definitely doesn't exist. Just checked.</p>
              <p>
                Take this{" "}
                <Link
                  to="/"
                  className="border-b-[3px] border-[var(--highlight)] text-[var(--highlight)] duration-200"
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

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

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
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="m-auto grid h-full min-h-0 max-w-[1200px] bg-[var(--bg)] p-4 text-[var(--fg)]">
        {children}
        {!noscript ? <Scripts /> : null}
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
