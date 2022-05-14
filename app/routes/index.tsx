import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as React from "react";
import type { LinksFunction, LoaderFunction, MetaFunction } from "remix";
import { json } from "remix";
import { useLoaderData } from "remix";
import { ClientOnly } from "remix-utils";
import type { Group } from "three";

import { ExternalLink } from "~/components";
import { Star } from "~/components/icons";
import { Star as ThreeStar } from "~/components/three";
import { KaizenText } from "~/components/three/KaizenText";
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
    <main className="home">
      <ClientOnly>{() => <KaizenCanvas stars={stars} hoveredProjectId={hoveredProjectId} />}</ClientOnly>
      <section className="projects z-20">
        <h2> Projects </h2>
        {data.projects.map((project) => (
          <ExternalLink
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
          </ExternalLink>
        ))}
      </section>
    </main>
  );
}

type KaizenCanvasProps = {
  stars: {
    projectId: string;
    id: string;
  }[];
  hoveredProjectId: React.MutableRefObject<string | null>;
};

function KaizenCanvas({ stars, hoveredProjectId }: KaizenCanvasProps) {
  let [textRef, setTextRef] = React.useState<Group | null>(null);
  return (
    <Canvas
      camera={{ position: [0, 0, 15] }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    >
      <Stars />

      <ambientLight intensity={1} color="#fababa" />
      <React.Suspense fallback={null}>
        <group position={[-6, 1, 0]}>
          {textRef && <directionalLight intensity={2} target={textRef} />}
          <pointLight intensity={1} position={[0, 1, 2]} />
          <KaizenText ref={setTextRef} />
          {stars.map((star) => (
            <StarInitializer star={star} key={star.id} hoveredProjectId={hoveredProjectId} />
          ))}
        </group>
      </React.Suspense>
    </Canvas>
  );
}

type StarInitializerProps = {
  star: {
    projectId: string;
    id: string;
  };
  hoveredProjectId: React.MutableRefObject<string | null>;
};

function StarInitializer({ star, hoveredProjectId }: StarInitializerProps) {
  const props = React.useRef({
    x: (4 + Math.random() * 8) * (Math.round(Math.random()) ? -1 : 1),
    y: -2 + Math.random() * 4,
    z: -0.25 + Math.random() * 1,
    rotationY: Math.random() * Math.PI * 2,
  });
  const { x, y, z, rotationY } = props.current;

  return (
    <ThreeStar
      position={[x, y, z]}
      rotation={[0, x > 0 ? Math.PI : 0, 0]}
      hoveredProjectId={hoveredProjectId}
      projectId={star.projectId}
      initialRotationY={rotationY}
    />
  );
}
