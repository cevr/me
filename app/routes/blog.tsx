import { Outlet } from "@remix-run/react";

import blogLayoutStyles from "../styles/blog-layout.css";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: blogLayoutStyles,
    },
  ];
}

export default function Screen() {
  return (
    <main className="blog-layout">
      <Outlet />
    </main>
  );
}
