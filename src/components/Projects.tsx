import { Project } from "@api/projects";
import ExternalLink from "./ExternalLink";
import { Star } from "./icons";
import styles from "./Projects.module.css";

interface ProjectsProps {
  projects: Project[];
}

function Projects({ projects }: ProjectsProps) {
  return (
    <section className={styles.projects}>
      <h2> Projects </h2>
      {projects.map((project) => (
        <ExternalLink
          href={project.url}
          aria-label={project.name}
          key={project.id}
        >
          <article className={styles.project}>
            <div className={styles["project-language"]}>
              {project.primaryLanguage?.name}
            </div>
            <h1 className={styles["project-name"]}>{project.name}</h1>
            <p className={styles["project-description"]}>
              {project.description}
            </p>
            <div className={styles["project-stargazers"]}>
              <span className={styles["stargazers-star"]}>
                <Star />
              </span>
              {project.stargazerCount}
            </div>
          </article>
        </ExternalLink>
      ))}
    </section>
  );
}

export default Projects;
