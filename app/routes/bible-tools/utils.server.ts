import type { AsyncTask } from 'ftld';
import { Result, Task } from 'ftld';
import { request } from 'undici';

import { DomainError } from '../../lib/domain-error';
import { env } from '../../lib/env.server';
import type { OpenAIChatFailedError } from './openai.server';
import { OpenAI } from './openai.server';

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
    .map((text) => text.source + ' (' + text.label + ')')
    .join(', ')}`;

const relatedEGWTextsPrompt = (
  relatedTexts: {
    source: string;
    label: string;
  }[],
) =>
  `Here are some related texts from the author Ellen G. White that may help you answer the question: ${relatedTexts
    .map((text) => text.source + ' (' + text.label + ')')
    .join(', ')}`;

const exploreMoreQuestionsPrompt = `You are tasked with giving the student more questions to ask to further understand and explore the topic.
  Requirements:

  - Only provide valid JSON as a response.
  - Do not provide more than three questions.
  - Do not provide any other text in the response.
  - Provide the following type of JSON object:
    ["$question1", "$question2", "$question3"]

    Example:
    Q: What is present truth?
    A: ["What is the seal of God?", "What is the mark of the beast?", "What is the third angel's message?"]
  `;

export type SearchEmbeddingsResponse = {
  egw: EmbeddingSource[];
  bible: EmbeddingSource[];
};
export type SearchEmbeddingsError = DomainError<'SearchEmbeddingsError'>;
export const SearchEmbeddingsError = DomainError.make('SearchEmbeddingsError');

export let searchEmbeddings = (
  query: string,
): AsyncTask<SearchEmbeddingsError, SearchEmbeddingsResponse> =>
  Task.from(
    () =>
      request(`${env.BIBLE_TOOLS_API}/search?q=${query}`, {
        headers: {
          'user-agent': 'cvr.im',
        },
      }).then((res) => res.body.json() as Promise<SearchEmbeddingsResponse>),
    (e) => SearchEmbeddingsError({ meta: e }),
  ).tapErr((err) => console.error(err));

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
  return searchEmbeddings(query)
    .flatMap((embeddings) =>
      OpenAI.chat([
        {
          role: 'system',
          content: settingPrompt,
        },
        {
          role: 'system',
          content: relatedBiblicalTextsPrompt(embeddings.bible),
        },
        {
          role: 'system',
          content: relatedEGWTextsPrompt(embeddings.egw),
        },
        {
          role: 'user',
          content: query,
        },
      ]).map(
        (content) =>
          ({
            ...embeddings,
            answer: content,
          }) satisfies SearchChatResponse,
      ),
    )
    .tapErr((err) => console.error(err));
};

type ExploreChatResponse = string[];

type NoJsonError = DomainError<'NoJsonError'>;
const NoJsonError = DomainError.make('NoJsonError');

type ExploreChatParseError = DomainError<'ExploreChatParseError'>;
const ExploreChatParseError = DomainError.make('ExploreChatParseError');

export let explore = (res: SearchChatResponse) =>
  OpenAI.chat([
    {
      role: 'system',
      content: exploreMoreQuestionsPrompt,
    },
    {
      role: 'system',
      content: relatedBiblicalTextsPrompt(res.bible),
    },
    {
      role: 'system',
      content: relatedEGWTextsPrompt(res.egw),
    },
    {
      role: 'user',
      content: res.answer,
    },
  ])
    .tap((content) => console.log(content))
    .flatMap((content) =>
      Result.fromPredicate(
        content.match(stringArrayRegex),
        (json): json is NonNullable<typeof json> => json !== null,
        () => NoJsonError(),
      ).flatMap((json) =>
        Result.tryCatch(
          () => JSON.parse(json[0]) as ExploreChatResponse,
          (e) => ExploreChatParseError(),
        ),
      ),
    )
    .schedule({
      retry: 3,
    })
    .tapErr((err) => console.error(err));

const stringArrayRegex = /\[.*\]/;
