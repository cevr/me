const bsconfig = require("./bsconfig.json");
const withOffline = require("next-offline");
const transpileModules = ["bs-platform"].concat(bsconfig["bs-dependencies"]);
const withTM = require("next-transpile-modules")(transpileModules);

module.exports = withTM(
  withOffline({
    target: "serverless",
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: "empty",
        };
      }

      return config;
    },
    workboxOpts: {
      swDest: "static/service-worker.js",
      runtimeCaching: [
        {
          urlPattern: /^https?.*/,
          handler: "NetworkFirst",
          options: {
            cacheName: "offlineCache",
            expiration: {
              maxEntries: 200,
            },
          },
        },
      ],
    },
    async rewrites() {
      return [
        {
          source: "/service-worker.js",
          destination: "/_next/static/service-worker.js",
        },
      ];
    },
  })
);
