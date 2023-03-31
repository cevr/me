import { env } from "./env.server";
import { TaskQueue } from "./utils";

const githubToken = env.GITHUB_TOKEN;
async function getSha(fileName: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/cevr/cms/contents/me/${fileName}`, {
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

async function push(fileName: string, data: any, commitMessage: string) {
  const sha = await getSha(fileName);
  return fetch(`https://api.github.com/repos/cevr/cms/contents/me/${fileName}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${githubToken}`,
      "Content-Type": "application/vnd.github+json",
    },
    body: JSON.stringify({
      message: commitMessage,
      committer: { name: "Cristian V. Ramos", email: "seeve.c@gmail.com" },
      content: Buffer.from(JSON.stringify(data)).toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status} ${await response.text()}`);
      }
      console.log(`Sucessfully pushed ${fileName} to github cms`);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const githubQueue = new TaskQueue();

export const GithubCMS = {
  get: async (fileName: string) => {
    const res = await fetch(`https://raw.githubusercontent.com/cevr/cms/main/me/${fileName}`);
    if (!res.ok) {
      throw new Error(`Could not fetch file: ${fileName}`);
    }
    return res;
  },
  push: (fileName: string, data: any, commitMessage: string) => {
    githubQueue.add(fileName, () => push(fileName, data, commitMessage));
  },
};
