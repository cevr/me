import { Nav, Footer, Head, ExternalLink } from 'components';
import Layout from 'layouts/Layout';

function Projects() {
  return (
    <Layout>
      <Head>
        <title>Contact | Cristian</title>
      </Head>
      <Nav />
      <main>
        <h1>Let's get in touch</h1>
        <blockquote>
          <ExternalLink className="email" href="mailto:hello@cevr.ca?subject=Hi Cristian!">
            hello@cevr.ca
          </ExternalLink>
        </blockquote>
      </main>
      <Footer />
      <style jsx>{`
        main {
          grid-area: content;
          display: grid;
          grid-gap: var(--grid-gap-sm);
          max-height: 100%;
          padding: 50px 0;
          grid-template:
            'title'
            'email';
          grid-template-rows: min-content min-content;
        }
        h1 {
          font-size: 2.5rem;
          grid-area: title;
        }

        blockquote {
          font-style: italic;
          margin: 0;
          padding-left: 1rem;
          border-left: 3px solid var(--accent);
          transition: border-color var(--transition);
        }
        blockquote:hover {
          color: var(--highlight);
          border-color: var(--highlight);
        }

        :global(.email) {
          grid-area: email;
          font-weight: 200;
          transition: color var(--transition);
        }
        :global(.email:hover) {
          color: var(--highlight);
        }
      `}</style>
    </Layout>
  );
}

export default Projects;
