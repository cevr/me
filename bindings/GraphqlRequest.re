type clientOptions('options) = Js.t('options);
type client;
type data = Js.Json.t;
[@new] [@module "graphql-request"]
external make: (string, clientOptions('options)) => client = "GraphQLClient";
[@bs.send]
external request: (client, string) => Js.Promise.t(data) = "request";
