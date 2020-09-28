module Options = {
  [@deriving abstract]
  type t('headers) = {
    [@optional]
    headers: Js.t('headers),
  };
  let make = t;
};

type client;
type data = Js.Json.t;
[@new] [@module "graphql-request"]
external make: (string, Options.t('any)) => client = "GraphQLClient";
[@bs.send]
external request: (client, string) => Js.Promise.t(data) = "request";
