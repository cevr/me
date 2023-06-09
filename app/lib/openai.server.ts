import { Task } from "ftld";
import { request } from "undici";

import { DomainError } from "./domain-error";
import { env } from "./env.server";

export type Embedding = number[];

type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

export type OpenAIChatFailedError = DomainError<"OpenAIChatFailedError">;
export const OpenAIChatFailedError = DomainError.make("OpenAIChatFailedError");

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
          model: "gpt-4",
          messages,
          temperature: 0,
        }),
      })
        .then((res) => res.body.json())
        .then((res) => res.choices[0].message.content) as Promise<string>,
    (e) => {
      console.error(e);
      return OpenAIChatFailedError("Could not connect to OpenAI API");
    },
  );
}

export const OpenAI = {
  chat,
};
