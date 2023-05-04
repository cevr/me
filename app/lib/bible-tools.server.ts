import { Result, Task } from "ftld";

import { DomainError } from "./domain-error";
import { env } from "./env.server";
import type { OpenAIChatFailedError } from "./openai.server";
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

const exploreSettingPrompt = `You have just given an initial answer to a bible student. Help them explore the topic further by providing them three more questions to ask that is related to the topic.`;

const exploreMoreQuestionsPrompt = (previousAnswer: string) =>
  `Here was your answer to the student's initial question: ${previousAnswer}. Please provide the additional questions in the following JSON format:
  Requirements:

  - Be sure to only provide a valid JSON object as a response.
  - Please provide no more than three questions.
  - Please do not provide any other text in the response.
  - Provide the following type of JSON object:
    ["$question1", "$question2", "$question3"]

  `;

export type SearchEmbeddingsError = DomainError<"SearchEmbeddingsError">;
export const SearchEmbeddingsError = DomainError.make("SearchEmbeddingsError");

export let searchEmbeddings = (query: string) =>
  Task.from(
    () =>
      fetch(`${env.BIBLE_TOOLS_API}/search?q=${query}`).then((res) => res.json()) as Promise<{
        egw: EmbeddingSource[];
        bible: EmbeddingSource[];
      }>,
    () => SearchEmbeddingsError(),
  );

type SearchChatResponse = {
  bible: EmbeddingSource[];
  egw: EmbeddingSource[];
  answer: string;
};

export let searchAndChat = (
  query: string,
): Task<
  SearchEmbeddingsError | OpenAIChatFailedError,
  {
    answer: string;
    egw: EmbeddingSource[];
    bible: EmbeddingSource[];
  }
> => {
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
    ]).map(
      (content) =>
        ({
          ...embeddings,
          answer: content,
        } satisfies SearchChatResponse),
    ),
  );
};

type ExploreChatResponse = string[];

type NoJsonError = DomainError<"NoJsonError">;
const NoJsonError = DomainError.make("NoJsonError");

type ExploreChatParseError = DomainError<"ExploreChatParseError">;
const ExploreChatParseError = DomainError.make("ExploreChatParseError");

export let explore = (res: SearchChatResponse) =>
  OpenAI.chat([
    {
      role: "system",
      content: exploreSettingPrompt,
    },
    {
      role: "system",
      content: relatedBiblicalTextsPrompt(res.bible),
    },
    {
      role: "system",
      content: relatedEGWTextsPrompt(res.egw),
    },
    {
      role: "system",
      content: exploreMoreQuestionsPrompt(res.answer),
    },
    {
      role: "user",
      content: "What are some other questions I can ask related to the topic?",
    },
  ])
    .tap((content) => console.log(content))
    .flatMap((content) =>
      Result.fromPredicate(
        (json): json is NonNullable<typeof json> => json !== null,
        content.match(stringArrayRegex),
        () => NoJsonError(),
      ).flatMap((json) =>
        Result.tryCatch(
          () => JSON.parse(json[0]) as ExploreChatResponse,
          (e) => ExploreChatParseError(),
        ),
      ),
    )
    .tapErr((err) => console.error(err))
    .schedule({
      retry: 3,
    });

const stringArrayRegex = /\[.*\]/;
