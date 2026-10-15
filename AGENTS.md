# me (cvr.im)

React Router 8 site, fully prerendered, served by one Cloudflare Worker (`src/worker/Site.ts`) declared in `alchemy.run.ts`.

- Gate: `bun run gate`. It never deploys.
- Static files win: Cloudflare's asset layer serves every prerendered page, feed and hashed file. The Worker only renders misses through React Router (`src/server/render.ts`). Asset caching lives in `public/_headers`.
- Deploy: `bun run plan` (prod plan), `bun run deploy` (prod, the owner's call). Throwaway stages: `bunx alchemy deploy alchemy.run.ts --stage agent-<topic> --yes`, then `destroy`. `bun run test:deploy` deploys, probes and destroys a `test_$USER` stage.
- State is in the Cloudflare state store (`Cloudflare.state()`), shared by every machine.
- Effect lint rules cover `src/`, `tests/` and `alchemy.run.ts`. React UI under `app/` gets base oxlint only; `app/components/ui/` is shadcn output and is not linted.
