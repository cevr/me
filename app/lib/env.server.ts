import * as z from "zod";

const unparsedEnv = {
  DEV_TO_TOKEN: process.env.DEV_TO_TOKEN,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
};

const envSchema = z.object({
  DEV_TO_TOKEN: z.string(),
  GITHUB_TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(unparsedEnv);
