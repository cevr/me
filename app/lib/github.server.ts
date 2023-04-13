import { env } from "./env.server";
import { TaskQueue } from "./utils";
import { allLimited } from "./utils/promises";

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

const githubToken = env.GITHUB_TOKEN;
async function getSha(path: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/cevr/cms/contents/${path}`, {
    headers: {
      Authorization: `token ${githubToken}`,
    },
  });
  if (res.ok) {
    const data = await res.json();
    return data.sha;
  }
  return null;
}

async function push(path: string, data: any, commitMessage: string) {
  const sha = await getSha(path);
  return fetch(`https://api.github.com/repos/cevr/cms/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${githubToken}`,
      "Content-Type": "application/vnd.github+json",
    },
    body: JSON.stringify({
      message: commitMessage,
      committer: { name: "cvr.im", email: "seeve.c@gmail.com" },
      content: Buffer.from(JSON.stringify(data)).toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status} ${await response.text()}`);
      }
      console.log(`Sucessfully pushed ${path} to github cms`);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const githubQueue = new TaskQueue();

async function get(path: string): Promise<unknown> {
  const res = await fetch(`https://raw.githubusercontent.com/cevr/cms/main/${path}`);
  if (!res.ok) {
    throw new Error(`Could not fetch file: ${path}`);
  }
  return res.json();
}

async function getDir(path: string) {
  const res = await fetch(`https://api.github.com/repos/cevr/cms/contents/${path}`, {
    headers: {
      Authorization: `token ${githubToken}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Could not fetch dir: ${path}`);
  }
  const files = (await res.json().then((res) => [res].flat())) as GitHubFile[];
  let count = 0;
  return allLimited(
    files.map((file: GitHubFile) => () => {
      const res = get(`${path}/${file.name}`);
      console.log(`Fetching ${path}/${file.name} (${++count}/${files.length})`);
      return res
    }),
    50,
  );
}

export const GithubCMS = {
  get,
  getDir,
  push: (fileName: string, data: any, commitMessage: string) => {
    githubQueue.add(fileName, () => push(fileName, data, commitMessage));
  },
};
