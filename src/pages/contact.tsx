import { Nav, Footer, Head, ExternalLink } from 'components';
import Layout from 'layouts/Layout';

const email = 'hello@cvr.im';

function Projects() {
  return (
    <Layout>
      <Head>
        <title>Contact | Cristian</title>
      </Head>
      <Nav />
      <main>
        <h1>Don't be shy</h1>
        <blockquote>
          <ExternalLink className="email" href={`mailto:${email}?subject=Hi Cristian!`}>
            {email}
          </ExternalLink>
        </blockquote>
      </main>
      <Footer />
      <style jsx>{`
        main {
          grid-area: content;
          display: grid;
          grid-gap: var(--grid-gap);
          max-height: 100%;
          padding-top: var(--main-padding);
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

        @media (max-width: 50rem) {
          main {
            padding: 0;
          }
        }
      `}</style>
    </Layout>
  );
}

export default Projects;
