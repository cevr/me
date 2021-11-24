import {
  LinksFunction,
  MetaFunction,
  LoaderFunction,
  ActionFunction,
  Meta,
  Links,
  Scripts,
  LiveReload,
  useCatch,
  Outlet,
  Link,
  redirect,
  useLoaderData,
} from "remix";

import darkStyles from "./styles/dark.css";
import lightStyles from "./styles/light.css";
import rootStyles from "./styles/root.css";
import navStyles from "./styles/nav.css";
import footerStyles from "./styles/footer.css";
import boundaryStyles from "./styles/boundary.css";
import tailwindStyles from "./styles/tailwind.css";
import { Footer, Nav } from "./components";
import { colorModeCookie } from "./lib";
import { useMemo } from "react";

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
      href: tailwindStyles,
    },
    {
      rel: "stylesheet",
      href: darkStyles,
    },
    { rel: "stylesheet", href: rootStyles },
    { rel: "stylesheet", href: navStyles },
    { rel: "stylesheet", href: footerStyles },
    { rel: "stylesheet", href: boundaryStyles },
  ];
};

export let meta: MetaFunction = () => {
  return {
    viewport: "width=device-width, initial-scale=1",
  };
};

export let loader: LoaderFunction = async ({ request }) => {
  let value =
    (await colorModeCookie.parse(request.headers.get("cookie"))) ?? {};
  value.colorMode ??= null;
  return { date: new Date(), colorMode: value.colorMode };
};

export let action: ActionFunction = async ({ request }) => {
  let value =
    (await colorModeCookie.parse(request.headers.get("cookie"))) ?? {};
  let params = new URLSearchParams(await request.text());
  value.colorMode = params.get("colorMode") ?? value.colorMode ?? null;
  return redirect(request.headers.get("Referer") ?? "/", {
    headers: {
      "Set-Cookie": await colorModeCookie.serialize(value),
    },
  });
};

export default function App() {
  let data =
    useLoaderData<{ date: string; colorMode: "dark" | "light" | null }>();

  const colorMode = useMemo(() => {
    if (data.colorMode) {
      return data.colorMode;
    }
    if (typeof window !== "undefined") {
      let lightColorScheme = window.matchMedia("(prefers-color-scheme: light)");
      return data.colorMode ?? lightColorScheme.matches ? "light" : "dark";
    }
    return "dark";
  }, [data.colorMode]);

  return (
    <Document>
      {colorMode === "light" ? (
        <link rel="stylesheet" href={lightStyles} />
      ) : null}
      <Nav colorMode={colorMode} />
      <Outlet />
      <Footer date={data.date} />
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
          <main className="boundary">
            <div>
              <p>Nope! This page definitely doesn't exist. Just checked.</p>
              <p>
                Take this{" "}
                <Link to="/" className="link-home" aria-label="home link">
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
          <main className="boundary">
            <div>
              <p>What??! Something went wrong you say?</p>
              <p>
                Click this{" "}
                <Link to="/" className="link-home" aria-label="home link">
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
      <main className="boundary">
        <div>
          <p>What??! Something went wrong you say?</p>
          <p>
            Click this{" "}
            <Link to="/" className="link-home" aria-label="home link">
              link
            </Link>{" "}
            back home and pretend you never saw anything.
          </p>
        </div>
      </main>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
