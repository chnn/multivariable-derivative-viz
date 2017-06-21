/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {});

  app.import('bower_components/katex/dist/katex.js', {
    using: [
      { transformation: 'amd', as: 'katex' }
    ]
  });
  app.import('bower_components/katex/dist/katex.css');

  const katexFonts = new Funnel('bower_components/katex/dist/fonts', {
    srcDir: '/',
    include: ['**/*.woff', '**/*.woff2', '**/*.ttf'],
    destDir: '/assets/fonts'
  });

  return app.toTree(katexFonts);
};
