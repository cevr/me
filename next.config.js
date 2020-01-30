/**@type */
module.exports = {
  webpack(config) {
    config.resolve.modules.push(`${__dirname}/src`);
    return config;
  },
  env: {
    TOKEN: process.env.TOKEN,
  },
};
