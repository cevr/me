import { Task } from "ftld";
import { request } from "undici";

import { env } from "./env.server";

export type Embedding = number[];

type Message = {
  role: "user" | "system";
  content: string;
};

class OpenAIChatFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenAIChatFailedError";
  }
}

function chat(messages: Message[]) {
  return Task.from(
    () =>
      request("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
          temperature: 0.2,
        }),
      })
        .then((res) => res.body.json())
        .then((res) => res.choices[0].message.content) as Promise<string>,
    (e) => {
      console.error(e);
      return new OpenAIChatFailedError("Could not connect to OpenAI API");
    },
  );
}

export const OpenAI = {
  chat,
};
