import * as z from "zod";

const envSchema = z.object({
  DEV_TO_TOKEN: z.string(),
  GITHUB_TOKEN: z.string(),
  OPENAI_API_KEY: z.string(),
  BIBLE_TOOLS_API: z.string().optional().default("https://bible-tools-api-production.up.railway.app"),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
