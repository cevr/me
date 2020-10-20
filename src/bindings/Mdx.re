type options;
[@obj] external makeOptions: (~components: 'a) => options;
[@module "next-mdx-remote/render-to-string"]
external renderToString: string => Promise.t(string) = "default";
[@module "next-mdx-remote/render-to-string"]
external renderToStringWithOptions: (string, options) => Promise.t(string) =
  "default";

[@module "next-mdx-remote/hydrate"]
external hydrate: string => React.element = "default";
[@module "next-mdx-remote/hydrate"]
external hydrateWithOptions: (string, options) => React.element = "default";
