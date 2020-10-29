import path from "path";
import fs from "fs";
import grayMatter from "gray-matter";

export interface Post {
  date: string;
  title: string;
  slug: string;
  content: string;
}

let postsDirectory = path.join(process.cwd(), "src", "posts");

let getPostSlugs = () =>
  fs.readdirSync(postsDirectory).filter((slug) => !slug.startsWith("."));

export let getPostBySlug = (slug: string): Post | null => {
  let pathToPost = path.join(postsDirectory, slug);
  let files = fs.readdirSync(pathToPost);
  let indexFile = files.find(
    (file) => file.substring(0, file.lastIndexOf(".")) === "index"
  );

  if (!indexFile) {
    return null;
  }

  let fullPath = path.join(pathToPost, indexFile);
  let fileContents = fs.readFileSync(fullPath, "utf8");
  let { data, content } = grayMatter(fileContents);

  return { ...(data as Post), content, slug };
};

export let getAllPosts = (): Post[] =>
  getPostSlugs()
    .map(getPostBySlug)
    .sort((post1, post2) => (post1?.date! > post2?.date! ? -1 : 1))
    .filter(Boolean) as Post[];
