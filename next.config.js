const bsconfig = require("./bsconfig.json");
const withOffline = require("next-offline");
const transpileModules = ["bs-platform"].concat(bsconfig["bs-dependencies"]);
const withTM = require("next-transpile-modules")(transpileModules);

module.exports = withTM(
  withOffline({
    env: {
      TOKEN: process.env.TOKEN,
    },
    target: "serverless",
    transformManifest: (manifest) => ["/"].concat(manifest),
    webpack(config) {
      config.resolve.modules.push(`${__dirname}/src`);
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
