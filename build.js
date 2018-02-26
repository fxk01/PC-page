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
  fileExclusionRegExp: /^(r|build)\.js|.*\.scss$|(\.idea$)|(\.gitattributes$)|(\.gitignore$)|(\.md$)|(LICENSE$)/,
  optimizeCss: 'standard',
  removeCombined: true
});