type styles = {home: string};
[@module "./index.module.css"] external styles: styles = "default";

type props = {projects: array(ProjectsApi.project)};

let default = (props: props) => {
  <Layout>
    <Head> <title> "Me | Cristian"->React.string </title> </Head>
    <Nav />
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
