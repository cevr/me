import { Link } from "@remix-run/react";

import { VerticalSpacer } from "~/components";

export let meta = () => ({
  title: "Apps | Cristian",
});

export default function AppsPage() {
  return (
    <main
      style={{
        gridArea: "content",
      }}
      className="m-auto w-full pt-12 h-full md:w-[100ch] pb-8"
    >
      <h1 className="text-5xl">Apps</h1>
      <VerticalSpacer />
      <ul className="flex flex-col gap-4 font-light">
        {apps.map((app) => (
          <li key={app.href} className="text-xl text-neutral-50 duration-200 hover:text-salmon-500">
            <Link to={app.href}>{app.description}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

const apps = [
  {
    href: "/hymns",
    description: "SDA Hymnal with transcribed chords and key transposition",
  },
  {
    href: "/bible-tools",
    description: "An AI powered bible study tool",
  },
];
