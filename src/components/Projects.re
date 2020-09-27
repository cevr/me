type styles = {
  projects: string,
  project: string,
  [@as "project-language"]
  projectLanguage: string,
  [@as "project-name"]
  projectName: string,
  [@as "project-description"]
  projectDescription: string,
  [@as "project-stargazers"]
  projectStargazers: string,
  [@as "stargazers-star"]
  stargazersStar: string,
};
[@module "./Projects.module.css"] external styles: styles = "default";

[@react.component]
let make = (~projects: array(ProjectsApi.project)) =>
  <section className={styles.projects}>
    <h2> "Projects"->React.string </h2>
    {projects
     ->Belt.Array.map(project =>
         <ExternalLink
           href={project.url} ariaLabel={project.name} key={project.id}>
           <article className={styles.project}>
             <div className={styles.projectLanguage}>
               {switch (project.primaryLanguage) {
                | Some(language) => language.name->React.string
                | None => React.null
                }}
             </div>
             <h3 className={styles.projectName}>
               project.name->React.string
             </h3>
             {switch (project.description) {
              | Some(description) =>
                <p className={styles.projectDescription}>
                  description->React.string
                </p>
              | None => React.null
              }}
             <div className={styles.projectStargazers}>
               <span className={styles.stargazersStar}> <Star /> </span>
               {{
                  project.stargazerCount;
                }
                ->Belt.Int.toString
                ->React.string}
             </div>
           </article>
         </ExternalLink>
       )
     ->React.array}
  </section>;
