import type { LinksFunction, MetaFunction } from "@remix-run/node";

import { ExternalLink } from "~/components";

export let links: LinksFunction = () => [
  {
    rel: "preload",
    href: "/images/me.jpg",
    as: "image",
  },
];

export let meta: MetaFunction = () => ({
  title: "About | Cristian",
});

export let handle = {
  noscript: true,
};

export default function AboutPage() {
  return (
    <main
      style={{
        gridArea: "content",
      }}
      className="flex flex-col md:grid md:grid-cols-3 gap-10 pt-12"
    >
      <section>
        <img
          className="aspect-square rounded-[50%] max-w-full h-auto mx-auto"
          src="/images/me.jpg"
          alt="Portrait of me"
        />
      </section>

      <section className="flex flex-col gap-3 col-span-2 md:pt-10">
        <h1 className="text-6xl">Hi, I'm Cristian.</h1>
        <p className="text-lg font-light text-[var(--accent)] leading-10">
          Professionally, I'm a product engineer that purses excellence in design, development, and testing.
        </p>

        <p className="text-lg font-light text-[var(--accent)] leading-10">
          Honestly, I'm just a guy who likes to code.
        </p>

        <ExternalLink
          className="text-[salmon] underline"
          href="https://www.investopedia.com/terms/k/kaizen.asp#:~:text=What%20Is%20Kaizen%3F,a%20gradual%20and%20methodical%20process."
        >
          What's kaizen?
        </ExternalLink>
      </section>
    </main>
  );
}
