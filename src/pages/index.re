type styles = {home: string};
[@module "./index.module.css"] external styles: styles = "default";

type props = {projects: array(ProjectsApi.project)};

let storageKey = "__LIGHT";
let lightModeClassName = "light";

let default = (props: props) => {
  let (lightMode, setLightMode) = React.useState(() => false);

  Hooks.useIsomorphicLayoutEffect0(() => {
    let lightModeOn = Document.bodyClassListContains(lightModeClassName);
    setLightMode(_ => lightModeOn);
    None;
  });

  let toggleTheme = (_event: ReactEvent.Mouse.t) => {
    let lightModeOn = Document.bodyClassListContains(lightModeClassName);
    let nextLightModeValue = !lightModeOn;

    setLightMode(_ => nextLightModeValue);
    LocalStorage.set(storageKey, Js.Json.boolean(nextLightModeValue));

    lightModeOn
      ? Document.bodyClassListRemove(lightModeClassName)
      : Document.bodyClassListAdd(lightModeClassName);
  };

  <Layout>
    <Next.Head>
      <title> "Me | Cristian"->React.string </title>
      <meta name="theme-color" content={lightMode ? "#0b7285" : "#FF8C69"} />
    </Next.Head>
    <Nav lightMode toggleTheme />
    <main className={styles.home}>
      <AboutMe />
      <Projects projects={props.projects} />
    </main>
    <Footer />
  </Layout>;
};

let getStaticProps = _context =>
  ProjectsApi.query()
  ->Promise.map(result => {
      let props = {projects: result};
      {"props": props, "revalidate": 1};
    });
