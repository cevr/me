import React from 'react';
import { NextPage } from 'next';
import { useAsync } from 'react-async';

import { Nav, Footer, Head, ExternalLink, KaizenLoading, ButtonLink, Star } from 'components';
import { getProjects } from 'utils/projects';
import Layout from 'layouts/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Me | Cristian</title>
        <link rel="preconnect" href="https://api.github.com" />
      </Head>
      <Nav />
      <main>
        <AboutMeSection />
        <ProjectsSection />
      </main>
      <Footer />
      <style jsx>{`
        main {
          grid-area: content;
          display: grid;
          grid-template-areas: 'about projects';
          grid-template-columns: 1fr 1fr;
          grid-gap: var(--grid-gap);
          max-height: 100%;
          padding-top: 50px;
        }

        @media (max-width: 800px) {
          main {
            grid-template-areas:
              'about'
              'projects';
            grid-template-columns: 1fr;
            margin-bottom: 1.5rem;
            padding: 0;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Home;

function KaizenLink() {
  const [hovered, setHovered] = React.useState(false);
  return (
    <ButtonLink
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      href="https://en.wikipedia.org/wiki/Kaizen"
    >
      {hovered ? 'kaizen' : '改善'}
    </ButtonLink>
  );
}

function AboutMeSection() {
  return (
    <section className="about">
      <h1>
        Hi, <br />
        I'm Cristian.
      </h1>
      <p className="desc">
        I'm a frontend developer though sometimes I call myself a full-stack developer too. I have a
        passion for improvement, believing fully in <KaizenLink />.
      </p>
      <p className="interests">
        I specialize in <ButtonLink href="https://reactjs.org/">React</ButtonLink>, I'm invested in{' '}
        <ButtonLink href="https://graphql.org/">GraphQL</ButtonLink>, and I love{' '}
        <ButtonLink href="https://nextjs.org/#features">Next.js</ButtonLink>.
      </p>
      <style jsx>
        {`
          .about {
            grid-area: about;
            display: grid;
            grid-template-areas:
              'name'
              'desc'
              'interests';
            grid-auto-rows: min-content;
            grid-gap: var(--grid-gap);
          }

          h1 {
            font-size: 3.5rem;
            grid-area: name;
          }

          p {
            font-size: 1.125rem;
            font-weight: 300;
            color: var(--accent);
          }
          .desc {
            grid-area: desc;
          }

          .interests {
            grid-area: interests;
          }
          @media (max-width: 800px) {
            h1 {
              font-size: 2.5rem;
            }
          }
        `}
      </style>
    </section>
  );
}

function ProjectsSection() {
  const { data = [], status } = useAsync(getProjects);

  const isLoading = status === 'pending';
  return isLoading ? (
    <KaizenLoading />
  ) : (
    <section className="projects">
      <h2>Projects</h2>
      {data.map(project => (
        <ExternalLink href={project.svn_url} aria-label={project.name} key={project.id}>
          <article className="project">
            <div className="project-language">{project.language}</div>
            <h3 className="project-name">{project.name}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-stargazers">
              <span className="stargazers-star">
                <Star aria-hidden />
              </span>
              {project.stargazers_count}
            </div>
          </article>
        </ExternalLink>
      ))}
      <style jsx>{`
        .projects {
          grid-area: projects;
          max-height: 100%;
          display: grid;
          grid-template-columns: 1fr;
          grid-auto-rows: minmax(min-content, max-content);
          grid-gap: var(--grid-gap);
          overflow-y: auto;
          padding: 10px;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .projects:after {
          content: '';
          display: block;
          height: 10px;
          width: 100%;
        }

        .projects::-webkit-scrollbar {
          display: none;
        }

        h2 {
          display: none;
        }

        .project {
          display: block;
          border: 2px solid;
          border-color: transparent;
          background-color: var(--link-bg);
          padding: 30px;
          transition: border-color, transform, var(--transition);
        }

        .project:hover {
          border-color: var(--highlight);
          transform: scale(1.04);
        }

        .project:hover .project-name,
        .project:hover .stargazers-star,
        .project:hover .project-language {
          color: var(--highlight);
        }

        .project-language {
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 2px;
          color: var(--fg);
        }

        .project-name {
          text-transform: capitalize;
          font-size: 1.5rem;
          font-weight: 500;
          color: var(--fg);
        }

        .project-description {
          color: var(--accent);
          font-size: 0.875rem;
          font-weight: 300;
        }

        .project-stargazers {
          color: var(--accent);
          font-size: 0.625rem;
          font-weight: 400;
          margin-top: 8px;
          display: flex;
        }

        .stargazers-star {
          height: 0.75rem;
          width: 0.75rem;
          margin-right: 0.25rem;
          display: block;
        }

        @media (max-width: 800px) {
          .projects {
            padding: 0;
          }

          h2 {
            display: initial;
            font-size: 1.75rem;
          }

          .project {
            padding: 1.25rem;
          }

          .project:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
