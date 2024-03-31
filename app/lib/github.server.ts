import type { AsyncTask } from "ftld";
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

function getSha(path: string): AsyncTask<GetShaFailedError, string> {
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

function push(path: string, data: any, commitMessage: string): AsyncTask<GetShaFailedError | PushFailedError, void> {
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
      (e) => PushFailedError({ message: "Could not get sha", meta: e }),
    ),
  );
}

type GetFileFailedError = DomainError<"GetFileFailedError">;
const GetFileFailedError = DomainError.make("GetFileFailedError");

function get<T>(path: string): AsyncTask<GetFileFailedError, T> {
  return Task.from(
    () => fetch(`https://raw.githubusercontent.com/cevr/cms/main/${path}`).then((res) => res.json()),
    (e) => GetFileFailedError({ message: "Could not fetch file", meta: e }),
  );
}

type GetDirFailedError = DomainError<"GetDirFailedError">;
const GetDirFailedError = DomainError.make("GetDirFailedError");

function getDir<T>(path: string): AsyncTask<GetDirFailedError | GetFileFailedError, T[]> {
  return Task.from(
    () =>
      request(`https://api.github.com/repos/cevr/cms/contents/${path}`, {
        headers: {
          Authorization: `token ${githubToken}`,
          "user-agent": "cvr.im",
        },
      }).then((res) => res.body.json().then((res) => [res].flat())) as Promise<GitHubFile[]>,
    (e) =>
      GetDirFailedError({
        message: "Could not fetch dir",
        meta: {
          path,
          e,
        },
      }),
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
