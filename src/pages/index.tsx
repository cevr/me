import { Nav, Footer, Head } from 'components';
import Layout from 'layouts/Layout';

const Home = () => (
  <Layout>
    <Head>
      <title>Home | Cristian</title>
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

export default Home;
