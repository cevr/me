import React from 'react';
import fetch from 'isomorphic-unfetch';
import { NextPage, NextPageContext } from 'next';

import { Nav, Footer, Head, ExternalLink } from 'components';
import { Star } from 'components/icons';
import Layout from 'layouts/Layout';

type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;

type Props = Await<ReturnType<typeof getInitialProps>>;

async function getInitialProps() {
  try {
    const projects: any[] = await fetch(
      'https://api.github.com/users/cevr/repos?page=1&per_page=100'
    ).then(res => res.json());

    const filteredProjects = projects
      .filter(project => !project.fork && !project.archived && project.stargazers_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count);

    return { projects: filteredProjects };
  } catch {
    return {};
  }
}

const ParagraphLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = props => (
  <>
    <ExternalLink className="paragraph-link" {...props} />
    <style jsx>{`
      :global(.paragraph-link) {
        color: var(--highlight);
        padding: 2px 10px;
        background-color: var(--link-bg);
        border-radius: 6px;
        transition: background-color 0.15s;
        white-space: nowrap;
      }
      :global(.paragraph-link:hover) {
        background-color: var(--highlight);
        color: white;
      }
    `}</style>
  </>
);

const KaizenLink: React.FC = () => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <ParagraphLink
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      href="https://en.wikipedia.org/wiki/Kaizen"
    >
      {hovered ? 'kaizen' : '改善'}
    </ParagraphLink>
  );
};

interface ProjectProps {
  project: {
    svn_url: string;
    id: number;
    language: string;
    name: string;
    description: string | null;
    stargazers_count: number;
  };
}

const Project: React.FC<ProjectProps> = ({ project }) => (
  <ExternalLink className="project" href={project.svn_url}>
    <div className="project-language">{project.language}</div>
    <div className="project-name">{project.name}</div>
    <div className="project-description">{project.description}</div>
    <div className="project-stargazers">
      <span className="stargazers-star">
        <Star />
      </span>
      {project.stargazers_count}
    </div>
    <style jsx>{`
      :global(.project) {
        display: block;
        border: 2px solid;
        border-color: transparent;
        background-color: var(--link-bg);
        padding: 30px;
        transition: border-color, transform, 0.15s;
      }
      :global(.project:hover) {
        border-color: var(--highlight);
        transform: scale(1.04);
      }

      :global(.project:hover .project-name, .project:hover .project-language) {
        color: var(--highlight);
      }

      .project-language {
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 2px;
      }

      .project-name {
        text-transform: capitalize;
        font-size: 26px;
        font-weight: 500;
      }

      .project-description {
        color: var(--accent);
        font-size: 14px;
        font-weight: 300;
      }

      .project-stargazers {
        color: var(--accent);
        font-size: 10px;
        font-weight: 400;
        margin-top: 8px;
        display: flex;
      }

      .stargazers-star {
        height: 12px;
        width: 12px;
        margin-right: 4px;
        display: block;
      }

      @media (max-width: 1080px) {
        .project {
          padding: 20px;
        }
      }
    `}</style>
  </ExternalLink>
);

const Home: NextPage<Props> = ({ projects = [] }) => {
  return (
    <Layout>
      <Head>
        <title>Me | Cristian</title>
      </Head>
      <Nav />
      <main>
        <h1>
          Hi, <br />
          I'm Cristian.
        </h1>
        <section className="about">
          <p>
            I'm a frontend developer though sometimes I call myself a software developer too. I have
            a passion for improvement, believing fully in <KaizenLink />.
          </p>
          <p>
            I love <ParagraphLink href="https://reactjs.org/">React</ParagraphLink>, I love{' '}
            <ParagraphLink href="https://graphql.org/">GraphQL</ParagraphLink>, and I love{' '}
            <ParagraphLink href="https://nextjs.org/#features">Next.js</ParagraphLink>.
          </p>
        </section>
        <section className="projects">
          <h2 className="projects-title">Projects</h2>
          {projects.map(project => (
            <Project project={project} key={project.id} />
          ))}
        </section>
      </main>
      <Footer />
      <style jsx>{`
        main {
          grid-area: content;
          display: grid;
          grid-template-areas:
            'name  projects'
            'about projects'
            'about projects';
          grid-template-columns: 1fr 1fr;
          grid-auto-rows: min-content;
          grid-gap: 10px;
          max-height: 100%;
          padding: 80px 0;
        }

        .about {
          grid-area: about;
          display: grid;
          grid-gap: 10px;
        }

        h1 {
          font-size: 56px;
          grid-area: name;
        }

        .about p {
          font-size: 18px;
          font-weight: 100;
          max-height: 300px;
        }

        .projects {
          grid-area: projects;
          max-height: 100%;
          display: grid;
          grid-template-columns: 1fr;
          grid-auto-rows: minmax(min-content, max-content);
          grid-gap: 10px;
          overflow-y: auto;
          padding: 10px;
        }

        .projects-title {
          font-size: 30px;
        }

        @media (max-width: 1080px) {
          main {
            grid-template-areas:
              'name     name'
              'about    about'
              'projects projects';
            padding: 40px 0;
            grid-gap: 20px;
          }

          h1 {
            font-size: 40px;
          }

          .about p {
            font-size: 16px;
          }

          .projects {
            padding: 0;
          }

          .projects-title {
            font-size: 24px;
          }
        }
      `}</style>
    </Layout>
  );
};

Home.getInitialProps = getInitialProps;

export default Home;
