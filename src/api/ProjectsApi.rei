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
let query: unit => Promise.t(array(project));
