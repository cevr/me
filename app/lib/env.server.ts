import * as z from 'zod';

const envSchema = z.object({
  DEV_TO_TOKEN: z.string(),
  GITHUB_TOKEN: z.string(),
  OPENAI_API_KEY: z.string(),
  BIBLE_TOOLS_API: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
