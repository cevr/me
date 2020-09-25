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
    transpileModules: ["bs-platform"].concat(bsconfig["bs-dependencies"]),
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
            cacheName: "https-calls",
            networkTimeoutSeconds: 15,
            expiration: {
              maxEntries: 150,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  })
);
