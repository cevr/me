module Options = {
  [@deriving abstract]
  type t('headers) = {
    [@optional]
    headers: Js.t('headers),
  };
  let make = t;
};

type client;

type errorLocation = {
  line: int,
  column: int,
};
type graphqlError = {
  message: string,
  path: array(string),
  locations: array(errorLocation),
};

[@new] [@module "graphql-request"]
external make: (string, Options.t('any)) => client = "GraphQLClient";
[@bs.send]
external requestRaw: (client, string) => Promise.Js.t('any, graphqlError) =
  "request";

let request = (client, string) =>
  requestRaw(client, string)->Promise.Js.toResult;
