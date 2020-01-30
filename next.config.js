const withOffline = require('next-offline');

module.exports = withOffline({
  webpack(config) {
    config.resolve.modules.push(`${__dirname}/src`);
    return config;
  },
  env: {
    TOKEN: process.env.TOKEN,
  },
  target: 'serverless',
  transformManifest: manifest => ['/'].concat(manifest),
  workboxOpts: {
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
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
});
