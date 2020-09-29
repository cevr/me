[@val] [@scope ("process", "env")] external token: string = "token";

let repositoriesQuery = {|
  query {
     user(login: "cevr") {
      repositories(first: 25, orderBy: {field: STARGAZERS, direction: DESC}, isFork: false, affiliations: [OWNER]) {
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
|};

type primaryLanguage = {name: string};

type project = {
  description: Js.nullable(string),
  name: string,
  stargazerCount: int,
  url: string,
  id: string,
  primaryLanguage: Js.nullable(primaryLanguage),
  isArchived: bool,
};

type edge = {node: project};

type repositories = {edges: array(edge)};

type user = {repositories};

type response = {user};

let headers = {"Authorization": {j|Bearer $token|j}};

let client =
  GraphqlRequest.make(
    "https://api.github.com/graphql",
    GraphqlRequest.Options.make(~headers, ()),
  );

let query = () =>
  GraphqlRequest.request(client, repositoriesQuery)
  ->Promise.map(response => {
      switch (response) {
      | Ok(data) =>
        data.user.repositories.edges
        ->Js.Array2.map(edge => edge.node)
        ->Js.Array2.filter(project =>
            project.stargazerCount > 1 && !project.isArchived
          )
      | Error(_) => [||]
      }
    });
