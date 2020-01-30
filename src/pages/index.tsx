import React from 'react';
import fetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import { useAsync } from 'react-async';

import { Nav, Footer, Head, ExternalLink } from 'components';
import { Star } from 'components/icons';
import Layout from 'layouts/Layout';

interface Project {
  svn_url: string;
  id: number;
  language: string;
  name: string;
  description: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
}

async function getProjects() {
  const projects: Project[] = await fetch(
    'https://api.github.com/users/cevr/repos?page=1&per_page=100',
    {
      headers: {
        Authorization: `token ${process.env.TOKEN}`,
      },
    }
  ).then(res => res.json());

  const filteredProjects = projects
    .filter(project => !project.fork && project.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);

  return filteredProjects;
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
        transition: background-color var(--transition);
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
  project: Project;
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
        transition: border-color, transform, var(--transition);
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
    `}</style>
  </ExternalLink>
);

const KaizenLoading = () => (
  <div>
    改善
    <style jsx>
      {`
        div {
          grid-area: projects;
          animation-name: color;
          animation-duration: 2s;
          animation-iteration-count: infinite;
          font-size: 64px;
          display: grid;
          justify-content: center;
          align-content: center;
          max-height: 100%;
        }

        @keyframes color {
          0% {
            color: var(--fg);
          }
          50% {
            color: var(--highlight);
          }
          100 {
            color: var(--fg);
          }
        }
      `}
    </style>
  </div>
);

const Home: NextPage = () => {
  const { data = [], status } = useAsync(getProjects);

  const isLoading = status === 'pending';
  return (
    <Layout>
      <Head>
        <title>Me | Cristian</title>
      </Head>
      <Nav />
      <main>
        <section className="about">
          <h1>
            Hi, <br />
            I'm Cristian.
          </h1>
          <p className="desc">
            I'm a frontend developer though sometimes I call myself a software developer too. I have
            a passion for improvement, believing fully in <KaizenLink />.
          </p>
          <p className="interests">
            I love <ParagraphLink href="https://reactjs.org/">React</ParagraphLink>, I love{' '}
            <ParagraphLink href="https://graphql.org/">GraphQL</ParagraphLink>, and I love{' '}
            <ParagraphLink href="https://nextjs.org/#features">Next.js</ParagraphLink>.
          </p>
        </section>
        {isLoading ? (
          <KaizenLoading />
        ) : (
          <section className="projects">
            {data.map(project => (
              <Project project={project} key={project.id} />
            ))}
          </section>
        )}
      </main>
      <Footer />
      <style jsx>{`
        main {
          grid-area: content;
          display: grid;
          grid-template-areas: 'about projects';
          grid-template-columns: 1fr 1fr;
          grid-gap: var(--grid-gap-sm);
          max-height: 100%;
          padding: 50px 0;
        }

        .about {
          grid-area: about;
          display: grid;
          grid-template-areas:
            'name'
            'desc'
            'interests';
          grid-auto-rows: min-content;
          grid-gap: var(--grid-gap-sm);
        }

        h1 {
          font-size: 56px;
          grid-area: name;
        }

        .about p {
          font-size: 18px;
          font-weight: 100;
        }
        .desc {
          grid-area: desc;
        }

        .interests {
          grid-area: interests;
        }

        .projects {
          grid-area: projects;
          max-height: 100%;
          display: grid;
          grid-template-columns: 1fr;
          grid-auto-rows: minmax(min-content, max-content);
          grid-gap: var(--grid-gap-sm);
          overflow-y: auto;
          padding: 10px;
          -ms-overflow-style: none; /* IE 11 */
          scrollbar-width: none; /* Firefox 64 */
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

        @media (max-width: 800px) {
          main {
            grid-template-areas:
              'name     name'
              'about    about'
              'projects projects';
            padding: 0;
            grid-gap: 1.5rem;
            margin-bottom: 1.5rem;
          }

          h1 {
            font-size: 2.5rem;
          }

          .about p {
            font-size: 16px;
          }

          .projects {
            padding: 0;
          }

          .project {
            padding: 20px;
          }

          :global(.project:hover) {
            transform: none !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Home;
