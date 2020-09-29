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

let decodeResponse: Js.Json.t => result(array(edge), unit) =
  (data: Js.Json.t) =>
    Belt.Result.(
      try(
        Ok(
          Obj.magic(Js.Json.(data->Obj.magic->parseExn))##user##repositories##edges,
        )
      ) {
      | Js.Exn.Error(_) => Error()
      }
    );

let headers = {"Authorization": {j|Bearer $token|j}};

let client =
  GraphqlRequest.make(
    "https://api.github.com/graphql",
    GraphqlRequest.Options.make(~headers, ()),
  );

let get = () =>
  Js.Promise.(
    GraphqlRequest.request(client, repositoriesQuery)
    |> then_(data => {resolve(data->decodeResponse)})
    |> then_(data => {
         switch (data) {
         | Ok(data) =>
           resolve(
             data
             ->Js.Array2.map(edge => edge.node)
             ->Js.Array2.filter(project =>
                 project.stargazerCount > 1 && !project.isArchived
               ),
           )
         | Error(_) => resolve([||])
         }
       })
  );
