import { Task } from "ftld";

import { OpenAI } from "./openai.server";

export type Embedding = number[];
export type EmbeddingWithSource = {
  source: string;
  label: string;
  embedding: Embedding;
};
export type EmbeddingSource = {
  source: string;
  label: string;
};

const settingPrompt = `You are a helpful assistant to a Seventh Day Adventist bible student. Please help them find the answer to their question.`;
const relatedBiblicalTextsPrompt = (
  relatedTexts: {
    source: string;
    label: string;
  }[],
) =>
  `Here are some related biblical texts that may help you answer the question: ${relatedTexts
    .map((text) => text.source + " (" + text.label + ")")
    .join(", ")}`;

const relatedEGWTextsPrompt = (
  relatedTexts: {
    source: string;
    label: string;
  }[],
) =>
  `Here are some related texts from the author Ellen G. White that may help you answer the question: ${relatedTexts
    .map((text) => text.source + " (" + text.label + ")")
    .join(", ")}`;

export class SearchEmbeddingsError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "SearchEmbeddingsError";
  }
}

export let searchEmbeddings = (query: string) =>
  Task.from(
    () =>
      fetch(`https://bible-tools-api-production.up.railway.app/search?q=${query}`).then((res) =>
        res.json(),
      ) as Promise<{
        egw: EmbeddingSource[];
        bible: EmbeddingSource[];
      }>,
    () => new SearchEmbeddingsError(),
  );

export let chat = (query: string) => {
  return searchEmbeddings(query).flatMap((embeddings) =>
    OpenAI.chat([
      {
        role: "system",
        content: settingPrompt,
      },
      {
        role: "system",
        content: relatedBiblicalTextsPrompt(embeddings.bible),
      },
      {
        role: "system",
        content: relatedEGWTextsPrompt(embeddings.egw),
      },
      {
        role: "user",
        content: query,
      },
    ]).map((content) => ({
      ...embeddings,
      answer: content,
    })),
  );
};
