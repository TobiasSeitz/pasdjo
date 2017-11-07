var gulp = require('gulp');
var util = require('gulp-util');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback');

gulp.task('default', function() {
  return util.log('gulp is running');
});


gulp.task('serve', function() {
  browserSync({
    port: 4000,
    notify: false,
    logPrefix: 'PASDJO',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function(snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: ['./'],
      middleware: [historyApiFallback()]
    }
  });
  gulp.watch('src/**/{*.js,*.html,*.png,*.jpg,*.css}', reload);
});