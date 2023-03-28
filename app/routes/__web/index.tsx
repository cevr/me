import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import * as React from "react";
import { ClientOnly } from "remix-utils";

import { Star } from "~/components/icons";
import { KaizenCanvas } from "~/components/three";
import { projectsApi } from "~/lib";
import type { Project } from "~/lib/projects.server";

export let meta: MetaFunction = () => {
  return {
    title: "Me | Cristian",
    description: "I'm looking to do what I can with a keyboard at hand.",
  };
};

export let links: LinksFunction = () => {
  return [];
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
    <>
      <ClientOnly>{() => <KaizenCanvas stars={stars} hoveredProjectId={hoveredProjectId} />}</ClientOnly>
      <main
        style={{
          gridArea: "content",
        }}
        className="content grid grid-cols-1 gap-5 md:gap-2 h-full overflow-y-auto pt-12 md:grid-cols-2 md:mb-6 md:p-0"
      >
        <section className="projects z-20 h-full flex flex-col gap-5 md:gap-2 overflow-y-auto scrollbar-hide p-2 md:p-0 md:col-start-2">
          <h2 className="hidden md:block md:h-auto md:text-xl">Projects</h2>
          <motion.div className="flex flex-col gap-3 p-1" variants={container} initial="hidden" animate="show">
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
                className="block border-2 border-transparent bg-[var(--link-bg)] p-4 transition-all transform hover:border-[var(--highlight)] md:hover:scale-[1.01] md:p-5"
              >
                <article className="">
                  <div className="project-language text-sm uppercase tracking-wider font-light text-[var(--fg)]">
                    {project.primaryLanguage?.name}
                  </div>
                  <h1 className="capitalize text-2xl font-medium text-[var(--fg)]">{project.name}</h1>
                  <p className="project-description text-[0.875rem] font-light text-[var(--accent)]">
                    {project.description}
                  </p>
                  <div className="project-stargazers flex gap-1 text-xs font-medium text-[var(--accent)] mt-2">
                    <span className="stargazers-star h-3 w-3">
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
    </>
  );
}
