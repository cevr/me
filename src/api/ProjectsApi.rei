type primaryLanguage = {name: string};
type project = {
  description: option(string),
  name: string,
  stargazerCount: int,
  url: string,
  id: string,
  primaryLanguage: option(primaryLanguage),
  isArchived: bool,
};
let get: unit => Js.Promise.t(array(project));
