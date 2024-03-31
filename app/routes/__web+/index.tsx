import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { cacheHeader } from "pretty-cache-header";

import { Star } from "~/components/icons";
import { projectsApi } from "~/lib";

export let meta: MetaFunction = () => [
  {
    title: "Me | Cristian",
    description: "I'm looking to do what I can with a keyboard at hand.",
  },
];

export let loader = async () => {
  const projects = await projectsApi.all().unwrap();
  return json(
    {
      projects,
    },
    {
      headers: {
        "cache-control": cacheHeader({
          public: true,
          maxAge: "1week",
          staleWhileRevalidate: "1year",
        }),
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

// function useStars(
//   projects: {
//     id: string;
//     stargazerCount: number;
//   }[],
// ) {
//   let stars = React.useMemo(() => {
//     return projects.flatMap((project) => {
//       return Array.from({ length: project.stargazerCount }, (_, i) => ({
//         projectId: project.id,
//         id: `${project.id}-${i}`,
//       }));
//     });
//   }, [projects]);
//   return stars;
// }

/* <ClientOnly>{() => <KaizenCanvas stars={stars} hoveredProjectId={hoveredProjectId} />}</ClientOnly> */
export default function Index() {
  let data = useLoaderData<typeof loader>();

  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      style={{
        gridArea: "content",
      }}
      className="flex flex-col gap-4 font-mono font-light text-neutral-300"
    >
      <motion.section variants={listItem} className="flex flex-col gap-4 md:flex-row-reverse">
        <motion.img
          variants={listItem}
          className="mx-auto aspect-square max-w-64 w-full rounded-md"
          src="/images/me.jpg"
          alt="Portrait of me"
        />

        <motion.div variants={listItem} className="flex flex-col gap-3 w-full">
          <h1 className="text-neutral-50 text-4xl md:text-6xl">Hi, I'm Cristian.</h1>
          <div>
            <p className="text-lg leading-10">I'm a product engineer that pursues excellence.</p>

            <p className="text-lg leading-10">I just like to be proud of my work.</p>
          </div>
        </motion.div>
      </motion.section>
      <motion.section variants={listItem} className="flex flex-col gap-4">
        <h2 className="text-2xl md:text-4xl text-neutral-50">Experiments</h2>

        <motion.ul variants={listItem} className="flex flex-col gap-4">
          {apps.map((app) => (
            <motion.li variants={listItem} key={app.href} className="text-lg duration-200 hover:text-salmon-500">
              <Link prefetch="intent" to={app.href}>
                {app.description}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>
      <motion.section variants={listItem} className="flex h-full flex-col gap-5 md:gap-2 md:p-0">
        <motion.h2 variants={listItem} className="text-2xl md:text-4xl text-neutral-50">
          Projects
        </motion.h2>
        <motion.ul variants={listItem} className="flex flex-col gap-2">
          {data.projects.map((project) => (
            <motion.li
              variants={listItem}
              key={project.id}
              onMouseEnter={() => {
                // hoveredProjectId.current = project.id;
              }}
              onMouseLeave={() => {
                // hoveredProjectId.current = null;
              }}
              className="text-xl duration-200 hover:text-salmon-500 group"
            >
              <a target="_blank" rel="noopener noreferrer" href={project.url} aria-label={project.name}>
                {/* <div className="flex items-center gap-1 text-xs font-medium shrink-0">
                  <span className="h-3 w-3">
                  </span>

                </div> */}
                <h3 className="text-lg font-medium capitalize text-pretty">
                  {project.name}{" "}
                  <span className="duration-200 md:opacity-0 group-hover:opacity-100 inline-flex gap-2 items-center tabular-nums md:text-salmon-500">
                    <Star className="h-3 w-3" /> {project.stargazerCount}
                  </span>
                </h3>
                {/* <p className="project-description text-[0.875rem] text-neutral-300">{project.description}</p> */}
                {/* <div className="project-language text-xs uppercase tracking-wider text-neutral-50">
                  {project.primaryLanguage?.name}
                </div> */}
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>
    </motion.main>
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
