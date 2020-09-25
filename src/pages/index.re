type styles = {home: string};
[@module "./index.module.css"] external styles: styles = "default";

type props = {projects: array(ProjectsApi.project)};

let default = (props: props) => {
  <Layout>
    <Head>
      <title> "Me | Cristian"->React.string </title>
      <link rel="preconnect" href="https://api.github.com" />
    </Head>
    <Nav />
    <main className={styles.home}>
      <AboutMe />
      <Projects projects={props.projects} />
    </main>
    <Footer />
  </Layout>;
};
let getServerSideProps = _context => {
  ProjectsApi.get()
  |> Js.Promise.then_((result: array(ProjectsApi.project)) => {
       Js.Promise.resolve(
         result->Belt.Array.keep(project =>
           project.stargazerCount > 1 && !project.isArchived
         ),
       )
     })
  |> Js.Promise.then_(result => {
       let props: props = {projects: result};
       Js.Promise.resolve({"props": props});
     });
};
