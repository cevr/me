import { Nav, Footer, Head } from 'components';
import Layout from 'layouts/Layout';

function Projects() {
  return (
    <Layout>
      <Head>
        <title>Contact | Cristian</title>
      </Head>
      <Nav />
      <main></main>
      <Footer />
      <style jsx>{`
        main {
          grid-area: content;
        }
      `}</style>
    </Layout>
  );
}

export default Projects;
