import type { AsyncTask} from "ftld";
import { Task } from "ftld";
import { gql, GraphQLClient } from "graphql-request";

let repositoriesQuery = gql`
  query {
    user(login: "cevr") {
      repositories(first: 25, orderBy: { field: STARGAZERS, direction: DESC }, isFork: false, affiliations: [OWNER]) {
        edges {
          node {
            description
            name
            stargazerCount
            url
            id
            primaryLanguage {
              name
            }
            isArchived
          }
        }
      }
    }
  }
`;

type Maybe<T> = T | null;

export interface Project {
  description: Maybe<string>;
  name: string;
  stargazerCount: number;
  url: string;
  id: string;
  primaryLanguage: Maybe<{ name: string }>;
  isArchived: boolean;
}

interface RepositoriesQueryData {
  user: Maybe<{
    repositories: Maybe<{
      edges: { node: Project }[];
    }>;
  }>;
}

let client = new GraphQLClient("https://api.github.com/graphql", {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

export let query = (): AsyncTask<never, Project[]> =>
  Task.from(() =>
    client
      .request<RepositoriesQueryData>(repositoriesQuery)
      .then(
        (data) =>
          data.user?.repositories?.edges
            .map((edge) => edge.node)
            .filter((project) => project.stargazerCount > 1 && !project.isArchived) ?? [],
      )
      .catch(() => [] as Project[]),
  );
