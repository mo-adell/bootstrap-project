//npm install --save-dev gulp gulp-sass sass gulp-concat gulp-terser gulp-cssnano gulp-autoprefixer browser-sync

//initializing modules
const 
      gulp         = require('gulp'),
      sass         = require('gulp-sass') (require('sass')),
      concat       = require('gulp-concat'),
      terser       = require('gulp-terser'),
      cssnano      = require('gulp-cssnano'),
      autoprefixer = require('gulp-autoprefixer'),
      browsersync  = require('browser-sync').create(),
      reload       = browsersync.reload;



//file path variables
const files = {
  html  :  ['*.html'], 
  scss  :  ['src/scss/style.scss', 'src/scss/**/*.scss', 'build/css/'],
  js    :  ['src/js/script.js',    'src/js/**/*.js',     'build/js/' ],
  bsCss :  ['node_modules/bootstrap/dist/css/bootstrap.min.css',  'build/css/'],
  bsJs  :  ['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',  'build/js/'],
  fas   :  ['node_modules/@fortawesome/fontawesome-free/css/all.min.css', 'build/css/font-awesome/css', 'node_modules/@fortawesome/fontawesome-free/webfonts/**/*', 'build/css/font-awesome/webfonts']
}
// D:\Route\s6\Task 6 - Mohamed Adel Gomaa\node_modules\@fortawesome\fontawesome-free

//managing external dependencies from node modules
const copy = () => {
  copyJs();
  copyCss();
  fas();
  fas2();
}
const copyJs = () => {
  //copying bootstrap js to src/js/vendors
  return gulp.src(files.bsJs[0])
  .pipe(gulp.dest(files.bsJs[1]));
}
const copyCss = () => {
  //copying bootstrap css to src/js/vendors
  return gulp.src(files.bsCss[0])
  .pipe(gulp.dest(files.bsCss[1]));
}
const fas = () => {
  return gulp.src(files.fas[0])
               .pipe(gulp.dest(files.fas[1]));
}
const fas2 = () => {
  return gulp.src(files.fas[2])
               .pipe(gulp.dest(files.fas[3]));
}


//scss to css task
const scssMini = () => {
  return gulp.src(files.scss[0], {sourcemaps: true })
              .pipe(sass().on('error', sass.logError))
              .pipe(autoprefixer({overrideBrowserslist : ['last 2 versions']}))
              .pipe(concat('style.min.css'))
              .pipe(cssnano())
            .pipe(gulp.dest(files.scss[2], {sourcemaps: '.' }));
}
const scss = () => {
  return gulp.src(files.scss[0], {sourcemaps: true })
              .pipe(sass().on('error', sass.logError))
              .pipe(autoprefixer({overrideBrowserslist : ['last 2 versions']}))
              .pipe(concat('style.css'))
              // .pipe(cssnano())
            .pipe(gulp.dest(files.scss[2], {sourcemaps: '.' }));
}
//scss to css watcher task
const watchScss = () => {
  scssMini();
  return gulp.watch(files.scss[1], scssMini);
}



//js task
const js = () => {
  return gulp.src(files.js[1], {sourcemaps: true })
              .pipe(concat('script.min.js'))
              .pipe(terser())
            .pipe(gulp.dest(files.js[2], {sourcemaps: '.' }));
}
//js watcher task
const watchJs = () => {
  js();
  return gulp.watch(files.js[1], js);
}



//browsersync tasks
const browsersyncServe = () => {
  browsersync.init({
    server: {
      baseDir: '.',
      notify: false
    }
  });
}



//default watcher task
const mainTask = () => {
  scssMini();
  js();
  browsersyncServe();
  gulp.watch(files.html[0]).on('change', reload); 
  gulp.watch(files.scss[1]).on('change', gulp.series(scssMini, reload));
  gulp.watch(files.js[1]).on('change', gulp.series(js, reload));
}



exports.copy    = copy;            //run this command to add bootstrap & fontawesome files to build
exports.js      = watchJs;         //run this command for js task only
exports.scss    = watchScss;       //run this command for scss task only
exports.css     = scss;            //run this command for exporting css normal file not minified
exports.default = mainTask;        //default command that runs everything
