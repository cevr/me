import { Task } from "ftld";
import { request } from "undici";

import { DomainError } from "./domain-error";
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
type GetShaFailedError = DomainError<"GetShaFailedError">;
const GetShaFailedError = DomainError.make("GetShaFailedError");

function getSha(path: string): Task<GetShaFailedError, string> {
  return Task.from(
    async () => {
      const res = (await request(`https://api.github.com/repos/cevr/cms/contents/${path}`, {
        headers: {
          Authorization: `token ${githubToken}`,
          "user-agent": "cvr.im",
        },
      })
        .then((res) => res.body.json())
        .then((res) => res.sha)) as Promise<string>;
      return res;
    },
    () => GetShaFailedError(),
  );
}

type PushFailedError = DomainError<"PushFailedError">;
const PushFailedError = DomainError.make("PushFailedError");

function push(path: string, data: any, commitMessage: string): Task<GetShaFailedError | PushFailedError, void> {
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
      () => PushFailedError("Could not get sha"),
    ),
  );
}

type GetFileFailedError = DomainError<"GetFileFailedError">;
const GetFileFailedError = DomainError.make("GetFileFailedError");

function get<T>(path: string): Task<GetFileFailedError, T> {
  return Task.from(
    () => fetch(`https://raw.githubusercontent.com/cevr/cms/main/${path}`).then((res) => res.json()),
    () => GetFileFailedError("Could not fetch file"),
  );
}

type GetDirFailedError = DomainError<"GetDirFailedError">;
const GetDirFailedError = DomainError.make("GetDirFailedError");

function getDir<T>(path: string): Task<GetDirFailedError | GetFileFailedError, T[]> {
  return Task.from(
    () =>
      request(`https://api.github.com/repos/cevr/cms/contents/${path}`, {
        headers: {
          Authorization: `token ${githubToken}`,
          "user-agent": "cvr.im",
        },
      }).then((res) => res.body.json().then((res) => [res].flat())) as Promise<GitHubFile[]>,
    () => GetDirFailedError("Could not fetch dir"),
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
