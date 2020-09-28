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

let decodeResponse: Js.Json.t => array(edge) =
  (data: Js.Json.t) =>
    Obj.magic(Js.Json.(data->stringify->parseExn))##user##repositories##edges;

// had to use this escape hatch since nextjs encodes/decodes props themselves within get{Static|ServerSide}Props
let unsafeRemoveUndefined: project => project = [%raw
  "(obj) => Object.fromEntries(Object.entries(obj).filter(([_key, value]) => value !== undefined))"
];

let headers = {"Authorization": {j|Bearer $token|j}};

let client =
  GraphqlRequest.make(
    "https://api.github.com/graphql",
    GraphqlRequest.Options.make(~headers, ()),
  );

let get = () =>
  GraphqlRequest.request(client, repositoriesQuery)
  |> Js.Promise.then_(data => {Js.Promise.resolve(data->decodeResponse)})
  |> Js.Promise.then_(data => {
       Js.Promise.resolve(
         data
         // decco decodes null as undefined, but nextjs cant serialize explicitly undefined values
         ->Belt.Array.map(edge => unsafeRemoveUndefined(edge.node))
         ->Belt.Array.keep(project =>
             project.stargazerCount > 1 && !project.isArchived
           ),
       )
     });
