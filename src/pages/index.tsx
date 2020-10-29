import Head from "next/head";

import { projectsApi } from "@api/index";
import { AboutMe, Projects } from "@components/index";
import styles from "./index.module.css";

interface IndexProps {
  projects: projectsApi.Project[];
}

function Index({ projects }: IndexProps) {
  return (
    <>
      <Head>
        <title>Me | Cristian</title>
      </Head>
      <main className={styles.home}>
        <AboutMe />
        <Projects projects={projects} />
      </main>
    </>
  );
}

export default Index;

export async function getStaticProps() {
  const projects = await projectsApi.query();
  return {
    props: { projects },
    revalidate: 1,
  };
}
