[@val] external token: string = "process.env.token";

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

[@decco.decode]
type primaryLanguage = {name: string};

[@decco.decode]
type project = {
  description: option(string),
  name: string,
  stargazerCount: int,
  url: string,
  id: string,
  primaryLanguage: option(primaryLanguage),
  isArchived: bool,
};

[@decco.decode]
type edge = {node: project};

[@decco.decode]
type repositories = {edges: array(edge)};

[@decco.decode]
type user = {repositories};

[@decco.decode]
type response = {user};

// had to use this escape hatch since nextjs encodes/decodes props themselves within get{Static|ServerSide}Props
let unsafeRemoveUndefined: project => project = [%raw
  "(obj) => Object.fromEntries(Object.entries(obj).filter(([_key, value]) => value !== undefined))"
];

let client =
  GraphqlRequest.make(
    "https://api.github.com/graphql",
    {
      "headers": {
        "Authorization": {j|Bearer $token|j},
      },
    },
  );

let get = () =>
  GraphqlRequest.request(client, repositoriesQuery)
  |> Js.Promise.then_(data => {Js.Promise.resolve(data->response_decode)})
  |> Js.Promise.then_(data => {
       switch (data) {
       | Ok(data) =>
         Js.Promise.resolve(
           data.user.repositories.edges
           // decco decodes null as undefined, but nextjs cant serialize explicitly undefined values
           ->Belt.Array.map(edge => unsafeRemoveUndefined(edge.node))
           ->Belt.Array.keep(project =>
               project.stargazerCount > 1 && !project.isArchived
             ),
         )
       | Error(_) => Js.Promise.resolve([||])
       }
     });
