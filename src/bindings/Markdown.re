type matter('a) = {
  data: 'a,
  content: string,
};
[@module "gray-matter"] external meta: string => matter('a) = "default";
