import fetch from 'isomorphic-unfetch';

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

export { getProjects };
