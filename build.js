({
  appDir: './',
  dir: './dist',
  baseUrl: './',
  modules: [
    {
      name: 'main',
      exclude: ['libs/jquery/jquery-2.1.4']
    }
  ],
  fileExclusionRegExp: /^(r|build)\.js|.*\.less|(\.idea$)|(\.gitattributes$)|(\.gitignore$)|(\.ejs$)|(\.md$)|(LICENSE$)|(utils$)|(test.js$)|(images$)|(node_modules$)|(components$)|(package.json$)|(package-lock.json$)|(gulpfile.js$)/,
  optimizeCss: 'standard',
  removeCombined: true
});