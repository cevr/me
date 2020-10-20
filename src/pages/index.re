type styles = {home: string};
[@module "./index.module.css"] external styles: styles = "default";

type props = {projects: array(ProjectsApi.project)};

let default = (props: props) => {
  <>
    <Next.Head> <title> "Me | Cristian"->React.string </title> </Next.Head>
    <main className={styles.home}>
      <AboutMe />
      <Projects projects={props.projects} />
    </main>
  </>;
};

let tenMinutes = 1 * 60 * 10;

let getStaticProps = _context =>
  ProjectsApi.query()
  ->Promise.map(result => {
      let props = {projects: result};
      {"props": props, "revalidate": tenMinutes};
    });
