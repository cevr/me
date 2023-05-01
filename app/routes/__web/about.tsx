import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";

import { ExternalLink } from "~/components";

export let links: LinksFunction = () => [
  {
    rel: "preload",
    href: "/images/me.jpg",
    as: "image",
  },
];

export let meta: V2_MetaFunction = () => [
  {
    title: "About | Cristian",
  },
];

export let handle = {
  noscript: true,
};

export default function AboutPage() {
  return (
    <main
      style={{
        gridArea: "content",
      }}
      className="flex flex-col gap-10 pt-12 sm:grid sm:grid-cols-3 overflow-y-auto max-h-full"
    >
      <section>
        <img
          className="mx-auto aspect-square h-auto max-w-full rounded-[50%]"
          src="/images/me.jpg"
          alt="Portrait of me"
        />
      </section>

      <section className="col-span-2 flex flex-col gap-3 md:pt-10">
        <h1 className="text-6xl">Hi, I'm Cristian.</h1>
        <p className="text-lg font-light leading-10 text-neutral-400">
          Professionally, I'm a product engineer that purses excellence in design, development, and testing.
        </p>

        <p className="text-lg font-light leading-10 text-neutral-400">Honestly, I'm just a guy who likes to code.</p>

        <ExternalLink href="https://www.investopedia.com/terms/k/kaizen.asp#:~:text=What%20Is%20Kaizen%3F,a%20gradual%20and%20methodical%20process.">
          What's kaizen?
        </ExternalLink>
      </section>
    </main>
  );
}
