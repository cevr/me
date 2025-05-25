import type { Config } from '@react-router/dev/config';

import hymns from './app/routes/hymns/hymns.json';

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  prerender: ['/', '/hymns', ...hymns.map((hymn) => `/hymns/${hymn.number}`)],
  future: {
    unstable_middleware: true,
    unstable_optimizeDeps: true,
    unstable_splitRouteModules: true,
    unstable_subResourceIntegrity: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
