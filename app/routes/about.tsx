import type { LinksFunction, MetaFunction } from "remix";

import { ExternalLink } from "~/components";

import aboutStylesheet from "../styles/about.css";

export let links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: aboutStylesheet,
  },
  {
    rel: "preload",
    href: "/images/me.jpg",
    as: "image",
  },
];

export let meta: MetaFunction = () => ({
  title: "About | Cristian",
});

export default function AboutPage() {
  return (
    <main className="about flex flex-col md:grid md:grid-cols-2 gap-10">
      <section>
        <img className="aspect-square rounded-[50%] max-w-full h-auto mx-auto" src="/images/me.jpg" alt="Portrait of me" />
      </section>

      <section className="flex flex-col gap-3">
        <h1 className="text-6xl">Hi, I'm Cristian.</h1>
        <p>Professionally, I'm a product engineer that purses excellence in design, development, and testing.</p>

        <p>Honestly, I'm just a guy who likes to code.</p>

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
