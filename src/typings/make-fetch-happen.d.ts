declare module "make-fetch-happen" {
  export function defaults({ cacheManager }: { cacheManager: string }): typeof fetch;
}
