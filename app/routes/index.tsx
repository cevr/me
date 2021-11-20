import * as React from "react";
import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useLoaderData } from "remix";

import { ExternalLink, ButtonLink } from "~/components";
import { Star } from "~/components/icons";
import { projectsApi } from "~/lib";
import { Project } from "~/lib/projects";
import indexStyles from "../styles/index.css";

export let meta: MetaFunction = () => {
  return {
    title: "Me | Cristian",
    description: "I'm looking to do what I can with a keyboard at hand.",
  };
};

export let links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: indexStyles,
    },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
  const projects = await projectsApi.query();
  return {
    projects,
  };
};

export default function Index() {
  let data = useLoaderData<{ projects: Project[] }>();

  return (
    <main className="home">
      <section className={"about"}>
        <NameTitle />
        <p className={"desc"}>
          A growing developer with a heart of code. I have a passion for
          improvement, believing fully in <KaizenLink />. I'm looking to do what
          I can with a keyboard at hand. Cheesy, right?
        </p>
        <p className={"interests"}>
          I specialize in{" "}
          <ButtonLink href="https://reactjs.org/">React</ButtonLink>, I'm a fan
          of <ButtonLink href="https://graphql.org/">GraphQL</ButtonLink>, I use{" "}
          <ButtonLink href="https://www.typescriptlang.org/">
            Typescript
          </ButtonLink>{" "}
          daily, and I love{" "}
          <ButtonLink href="https://nextjs.org/#features">Next.js</ButtonLink>
          .
          <br />
          In fact,{" "}
          <ButtonLink href="https://github.com/cevr/me">
            this website
          </ButtonLink>{" "}
          is using all of them!
        </p>
      </section>
      <section className={"projects"}>
        <h2> Projects </h2>
        {data.projects.map((project) => (
          <ExternalLink
            href={project.url}
            aria-label={project.name}
            key={project.id}
          >
            <article className={"project"}>
              <div className="project-language">
                {project.primaryLanguage?.name}
              </div>
              <h1 className="project-name">{project.name}</h1>
              <p className="project-description">{project.description}</p>
              <div className="project-stargazers">
                <span className="stargazers-star">
                  <Star />
                </span>
                {project.stargazerCount}
              </div>
            </article>
          </ExternalLink>
        ))}
      </section>
    </main>
  );
}

function NameTitle() {
  let [showFull, setShowFull] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setShowFull(true), 1500);
  }, []);

  return (
    <h1>
      <span className={"name"}>
        <span>C</span>
        {showFull ? (
          <span className="animating-name first-name">ristian </span>
        ) : null}
      </span>
      <span className={"name"}>
        <span>V</span>
        {showFull ? (
          <span className="animating-name first-family-name">elasquez </span>
        ) : null}
      </span>
      <span className={"name"}>
        <span>R</span>
        {showFull ? (
          <span className={"animating-name second-family-name"}>amos</span>
        ) : null}
      </span>
    </h1>
  );
}

function KaizenLink() {
  let [hovered, setHovered] = React.useState(false);
  return (
    <ButtonLink
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      href="https://en.wikipedia.org/wiki/Kaizen"
    >
      {hovered ? "kaizen" : `改善`}
    </ButtonLink>
  );
}
