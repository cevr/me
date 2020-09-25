type styles = {home: string};
[@module "./index.module.css"] external styles: styles = "default";

let lightModeClassName = "light";

type props = {projects: array(ProjectsApi.project)};

let default = (props: props) => {
  let (lightMode, setLightMode) = React.useState(() => true);

  React.useEffect0(() => {
    let lightModeOn = Document.bodyClassListContains(lightModeClassName);
    setLightMode(_ => lightModeOn);
    None;
  });

  <Layout>
    <Head>
      <title> "Me | Cristian"->React.string </title>
      <meta name="theme-color" content={lightMode ? "#0b7285" : "#FF8C69"} />
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
