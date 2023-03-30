import { env } from "./env.server";
import { TaskQueue } from "./utils";

const url = `https://api.github.com/repos/cevr/cms`;

async function pushToPublic(fileName: string, data: any, commitMessage: string) {
  const githubToken = env.GITHUB_TOKEN;

  async function fetchAndCheck(url: RequestInfo | URL, options: RequestInit | undefined) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
  }

  try {
    const content = JSON.stringify(data, null, 2);
    const filePath = `me/${fileName}`;

    const branchData = await fetchAndCheck(`${url}/git/ref/heads/main`, {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    });

    const branchSha = branchData.object.sha;

    const commitData = await fetchAndCheck(`${url}/git/commits/${branchSha}`, {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    });

    const treeSha = commitData.tree.sha;

    const treeData = await fetchAndCheck(`${url}/git/trees`, {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base_tree: treeSha,
        tree: [
          {
            path: filePath,
            mode: "100644",
            type: "blob",
            content,
          },
        ],
      }),
    });

    const newTreeSha = treeData.sha;

    const commitDataNew = await fetchAndCheck(`${url}/git/commits`, {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        parents: [branchSha],
        tree: newTreeSha,
      }),
    });

    const newCommitSha = commitDataNew.sha;

    await fetchAndCheck(`${url}/git/refs/heads/main`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sha: newCommitSha,
      }),
    });

    console.log(`${fileName} committed and pushed to CMS successfully.`);
  } catch (error) {
    console.error(`Error while committing and pushing ${fileName}:`, error);
  }
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
    githubQueue.add(fileName, () => pushToPublic(fileName, data, commitMessage));
  },
};
