// The type of `#server-build`: React Router's server build (`build/server/index.js`),
// written by `react-router build`. package.json `imports` points TypeScript here
// and the Worker bundle at the built file, so the typecheck never needs a build.
import type { ServerBuild } from "react-router";

declare const build: ServerBuild;
export = build;
