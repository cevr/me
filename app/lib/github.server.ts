import { Task } from "ftld";
import { request } from "undici";

import { env } from "./env.server";

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

class GetShaFailedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "GetShaFailedError";
  }
}

function getSha(path: string): Task<GetShaFailedError, string> {
  return Task.from(async () => {
    const res = (await request(`https://api.github.com/repos/cevr/cms/contents/${path}`, {
      headers: {
        Authorization: `token ${githubToken}`,
        "user-agent": "cvr.im",
      },
    })
      .then((res) => res.body.json())
      .then((res) => res.sha)) as Promise<string>;
    return res;
  });
}

class PushFailedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PushFailedError";
  }
}

function push(path: string, data: any, commitMessage: string): Task<PushFailedError, void> {
  return getSha(path).flatMap((sha) =>
    Task.from(
      async () => {
        await request(`https://api.github.com/repos/cevr/cms/contents/${path}`, {
          method: "PUT",
          headers: {
            Authorization: `token ${githubToken}`,
            "Content-Type": "application/vnd.github+json",
            "user-agent": "cvr.im",
          },
          body: JSON.stringify({
            message: commitMessage,
            committer: { name: "cvr.im", email: "seeve.c@gmail.com" },
            content: Buffer.from(JSON.stringify(data)).toString("base64"),
            ...(sha ? { sha } : {}),
          }),
        });
      },
      () => new PushFailedError("Could not get sha"),
    ),
  );
}

class GetFailedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "GetFailedError";
  }
}

function get<T>(path: string): Task<GetFailedError, T> {
  return Task.from(
    () => fetch(`https://raw.githubusercontent.com/cevr/cms/main/${path}`).then((res) => res.json()),
    () => new GetFailedError("Could not fetch file"),
  );
}

class GetDirFailedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "GetDirFailedError";
  }
}

function getDir<T>(path: string): Task<GetDirFailedError | GetFailedError, T[]> {
  return Task.from(
    () =>
      request(`https://api.github.com/repos/cevr/cms/contents/${path}`, {
        headers: {
          Authorization: `token ${githubToken}`,
          "user-agent": "cvr.im",
        },
      }).then((res) => res.body.json().then((res) => [res].flat())) as Promise<GitHubFile[]>,
    () => new GetDirFailedError("Could not fetch dir"),
  ).flatMap((files) => {
    let count = 0;
    return Task.parallel(
      files.map((file: GitHubFile) => {
        return get<T>(`${path}/${file.name}`).tap(() => {
          console.log(`Fetching ${path}/${file.name} (${++count}/${files.length})`);
        });
      }),
      50,
    );
  });
}

export const GithubCMS = {
  get,
  getDir,
  push,
};
