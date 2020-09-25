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
type grapqhqlResponse = {user};

// had to use this escape hatch since null doesnt work well in reason
let unsafeRemoveUndefined = [%raw
  "(obj) => Object.fromEntries(Object.entries(obj).filter(([_key, value]) => value !== undefined))"
];

module GraphqlRequest = {
  type clientOptions('options) = Js.t('options);
  type client;
  type data = Js.Json.t;
  [@new] [@module "graphql-request"]
  external make: (string, clientOptions('options)) => client =
    "GraphQLClient";
  [@bs.send]
  external request: (client, string) => Js.Promise.t(data) = "request";
};

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
  |> Js.Promise.then_(data => {
       Js.Promise.resolve(data->grapqhqlResponse_decode)
     })
  |> Js.Promise.then_(data => {
       switch (data) {
       | Ok(data) =>
         Js.Promise.resolve(
           data.user.repositories.edges
           // decco decodes null as undefined, but nextjs cant serialize explicitly undefined values
           ->Belt.Array.map(edge => unsafeRemoveUndefined(edge.node)),
         )
       | Error(_) => Js.Promise.resolve([||])
       }
     });
