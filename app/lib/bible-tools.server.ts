import { Configuration, OpenAIApi } from "openai";

import { env } from "./env.server";
import { GithubCMS } from "./github.server";
import { omit, TaskQueue } from "./utils";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: env.OPENAI_API_KEY,
  }),
);

type Embedding = number[];

export type LabeledEmbedding = {
  embedding: Embedding;
  label: string;
  source: string;
};

declare global {
  var bibleCache: {
    data?: {
      embeddings: LabeledEmbedding[][];
      timestamp: number;
    };
  };
  var egwCache: {
    data?: {
      embeddings: LabeledEmbedding[][];
      timestamp: number;
    };
  };
  var embeddingsQueue: TaskQueue<LabeledEmbedding[][]>;
}

const egwEmbeddingsPath = "embeddings/egw";
const bibleEmbeddingsPath = "embeddings/bible";

let embeddingsQueue = new TaskQueue<LabeledEmbedding[][]>();
let egwCache: typeof global.egwCache = {};
let bibleCache: typeof global.bibleCache = {};

if (process.env.NODE_ENV !== "production") {
  if (!global.egwCache) {
    global.egwCache = {};
  }
  if (!global.bibleCache) {
    global.bibleCache = {};
  }
  if (!global.embeddingsQueue) {
    global.embeddingsQueue = new TaskQueue<LabeledEmbedding[][]>();
  }
  egwCache = global.egwCache;
  bibleCache = global.bibleCache;
  embeddingsQueue = global.embeddingsQueue;
}

export async function getEgwEmbeddings() {
  if (egwCache.data) {
    return egwCache.data.embeddings;
  }
  const data = await embeddingsQueue.add(
    "bible-embeddings",
    () => GithubCMS.getDir(egwEmbeddingsPath) as Promise<LabeledEmbedding[][]>,
  );

  egwCache.data = {
    embeddings: data,
    timestamp: Date.now(),
  };

  return data;
}

export async function getBibleEmbeddings() {
  if (bibleCache.data) {
    return bibleCache.data.embeddings;
  }
  const data = await embeddingsQueue.add("egw-embeddings", async () => {
    const bible = (await GithubCMS.getDir(bibleEmbeddingsPath)) as {
      book: string;
      verse: number;
      chapter: number;
      embedding: Embedding;
      text: string;
    }[][];

    return bible.map((verses) =>
      verses.map((verse) => ({
        source: verse.text,
        label: `${verse.book} ${verse.chapter}:${verse.verse}`,
        embedding: verse.embedding,
      })),
    );
  });

  bibleCache.data = {
    embeddings: data,
    timestamp: Date.now(),
  };

  return data;
}

export async function searchEmbeddings(query: string, k = 5) {
  const queryEmbedding = await openai
    .createEmbedding({
      input: query,
      model: "text-embedding-ada-002",
    })
    .then((res) => res.data.data[0].embedding);

  const egw = await getEgwEmbeddings();
  const bible = await getBibleEmbeddings();

  const egwResults = compareEmbeddingToMultipleSets(queryEmbedding, egw, 0.8, 3);
  const bibleResults = compareEmbeddingToMultipleSets(queryEmbedding, bible, 0.8, 3);
  console.log({ egwResults, bibleResults });
  const completion = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: settingPrompt },
        {
          role: "system",
          content: relatedBiblicalTextsPrompt(bibleResults),
        },
        {
          role: "system",
          content: relatedEGWTextsPrompt(egwResults),
        },
        { role: "user", content: query },
      ],
      temperature: 0.5,
    })
    .then((res) => res.data.choices.map((choice) => choice.message?.content!));
  return { answer: completion[0], egwResults, bibleResults };
}

function cosineSimilarity(a: Embedding, b: Embedding): number {
  if (a.length !== b.length) {
    throw new Error("Embeddings must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function findSimilarities(
  query: Embedding,
  embeddings: LabeledEmbedding[],
  threshold: number,
  includeContext = true,
) {
  const similarities: {
    result: Omit<LabeledEmbedding, "embedding">[];
    score: number;
  }[] = [];

  for (let index = 0; index < embeddings.length; index++) {
    try {
      const similarity = cosineSimilarity(query, embeddings[index].embedding);

      if (similarity >= threshold) {
        similarities.push({
          result: includeContext
            ? withOverlap(embeddings, index, 1).map((e) => omit(e, ["embedding"]))
            : [omit(embeddings[index], ["embedding"])],
          score: similarity,
        });
      }
    } catch (error) {
      // Skip this pair of embeddings if they have different lengths
    }
  }

  return similarities;
}

function withOverlap(embeddings: LabeledEmbedding[], index: number, k: number) {
  const start = Math.max(0, index - k);
  const end = Math.min(embeddings.length, index + k);
  return embeddings.slice(start, end);
}

export function compareEmbeddingToMultipleSets(
  query: Embedding,
  embeddingSets: LabeledEmbedding[][],
  threshold: number,
  k: number,
) {
  return embeddingSets
    .flatMap((embeddingSet) => findSimilarities(query, embeddingSet, threshold))
    .sort((a, b) => (a.score > b.score ? -1 : 1))
    .slice(0, k)
    .flatMap((sim) => sim.result);
}

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
