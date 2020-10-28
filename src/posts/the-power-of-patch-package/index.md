---
title: "The power of patch-package"
date: "10-28-2020"
---

Have you ever been in a situation where a package has a bug that's blocking you?

Have you ever gone to the package's github page, searched for an issue that matches your problem, and commented "I need this fix"?

Stop that.

What you need is [patch-package](https://github.com/ds300/patch-package).

I can't tell you enough how useful this is. Instead of having to wait for fixes to be released, I use this tool as a hotfix, and when a new version is ready that includes the fix, I simply delete the patch file it generates.

Here's an example that came up recently:

I upgraded our app to CRA 4.0 at work, but noticed that the build and rebuild times became much slower.

Looked around to find [this comment](https://github.com/facebook/create-react-app/issues/9886#issuecomment-716234004) inside a github issue that matched my problem.

Went to the `node_modules/react-scripts/config/webpack.config.js` like it said and plopped this in:

```js {3}
new ESLintPlugin({
    // Plugin options
    cache: true,
    extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
    formatter: require.resolve('react-dev-utils/eslintFormatter'),
    ...
```

All that was left was to run `yarn patch-package react-scripts`.

Aww man, it's that easy?

Yeah, it is.
