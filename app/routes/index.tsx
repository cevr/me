import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import * as React from "react";

import { Star } from "~/components/icons";
import { KaizenCanvas } from "~/components/three";
import { projectsApi } from "~/lib";
import type { Project } from "~/lib/projects.server";

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
  let oneDay = 1000 * 60 * 60 * 24;
  return json(
    {
      projects,
    },
    {
      headers: {
        "Cache-Control": `s-maxage=${oneDay}, stale-while-revalidate`,
      },
    },
  );
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.075,
    },
  },
};

const listItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export default function Index() {
  let data = useLoaderData<{ projects: Project[] }>();
  let stars = React.useMemo(() => {
    return data.projects.flatMap((project) => {
      return Array.from({ length: project.stargazerCount }, (_, i) => ({
        projectId: project.id,
        id: `${project.id}-${i}`,
      }));
    });
  }, [data.projects]);
  let hoveredProjectId = React.useRef<string | null>(null);

  return (
    <main className="home flex flex-col">
      <KaizenCanvas stars={stars} hoveredProjectId={hoveredProjectId} />
      <section className="projects z-20">
        <h2> Projects </h2>
        <motion.div className="flex flex-col gap-3" variants={container} initial="hidden" animate="show">
          {data.projects.map((project) => (
            <motion.a
              variants={listItem}
              target="_blank"
              rel="noopener noreferrer"
              href={project.url}
              aria-label={project.name}
              key={project.id}
              onMouseEnter={() => {
                hoveredProjectId.current = project.id;
              }}
              onMouseLeave={() => {
                hoveredProjectId.current = null;
              }}
            >
              <article className="project">
                <div className="project-language">{project.primaryLanguage?.name}</div>
                <h1 className="project-name">{project.name}</h1>
                <p className="project-description">{project.description}</p>
                <div className="project-stargazers">
                  <span className="stargazers-star">
                    <Star />
                  </span>
                  {project.stargazerCount}
                </div>
              </article>
            </motion.a>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
