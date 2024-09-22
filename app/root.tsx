import './styles/font.css';
import './styles/root.css';

import type { LinksFunction } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useRouteError,
} from '@remix-run/react';
import { RouterProvider } from 'react-aria-components';

export let links: LinksFunction = () => {
  return [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ];
};

export default function App() {
  const navigate = useNavigate();
  return (
    <Document>
      <RouterProvider navigate={navigate}>
        <Outlet />
      </RouterProvider>
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
                gridArea: 'content',
              }}
              className="grid h-full place-items-center text-center text-lg leading-8 text-neutral-500 duration-200"
            >
              <div>
                <p>Nope! This page definitely doesn't exist. Just checked.</p>
                <p>
                  Take this{' '}
                  <Link
                    to="/"
                    className="border-b-[3px] border-salmon-500 text-salmon-500 duration-200"
                    aria-label="home link"
                  >
                    link
                  </Link>{' '}
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
                gridArea: 'content',
              }}
            >
              <div>
                <p>What??! Something went wrong you say?</p>
                <p>
                  Click this{' '}
                  <Link
                    to="/"
                    className="border-b-3 duration-200"
                    aria-label="home link"
                  >
                    link
                  </Link>{' '}
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
          gridArea: 'content',
        }}
      >
        <div>
          <p>What??! Something went wrong you say?</p>
          <p>
            Click this{' '}
            <Link
              to="/"
              className="border-b-3 duration-200"
              aria-label="home link"
            >
              link
            </Link>{' '}
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
    <html
      lang="en"
      className="dark h-full"
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body
        className="size-full bg-neutral-900 text-neutral-50"
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateAreas: `"nav"
    "content"
    "footer"`,
            gridTemplateRows: 'auto 1fr auto',
          }}
          className="m-auto h-full min-h-0 max-w-[100vw] gap-12 p-4 md:max-w-[1200px]"
        >
          {children}
        </div>
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}
