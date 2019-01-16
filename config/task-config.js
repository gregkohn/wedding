var browserSync = require('browser-sync')
var cssnano = require('cssnano')
var easyImport = require('postcss-easy-import')
var gulpif = require('gulp-if')
var mixins = require('postcss-mixins')
var nesting = require('postcss-nesting')
var path = require('path')
var postcss = require('gulp-postcss')
var reporter = require('postcss-reporter')
var sourcemaps = require('gulp-sourcemaps')
var units = require('postcss-units')
var presetEnv = require('postcss-preset-env')
var tailwindcss = require('tailwindcss')
var purgecss = require('gulp-purgecss')

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || []
  }
}

module.exports = {
  html: true,
  images: true,
  static: true,
  svgSprite: true,
  ghPages: true,

  javascripts: {
    entry: {
      // files paths are relative to
      // javascripts.dest in path-config.json
      app: ['./app.js']
    }
  },

  stylesheets: {
    alternateTask: function(gulp, PATH_CONFIG, TASK_CONFIG) {
      // PostCSS
      return function() {
        const paths = {
          src: path.resolve(
            process.env.PWD,
            PATH_CONFIG.src,
            PATH_CONFIG.stylesheets.src,
            '*.css'
          ),
          dest: path.resolve(
            process.env.PWD,
            PATH_CONFIG.dest,
            PATH_CONFIG.stylesheets.dest
          )
        }

        const cssnanoConfig = TASK_CONFIG.stylesheets.cssnano || {}
        cssnanoConfig.autoprefixer = false // this should always be false, since we're autoprefixing separately

        const plugins = [
          easyImport(),
          mixins(),
          units(), // provides em() and rem() functions
          tailwindcss('../../tailwind.js'),
          nesting(), // use a more update version of postcss-nesting
          presetEnv(),
          reporter({ clearReportedMessages: true })
        ]

        if (global.production) {
          plugins.push(cssnano(cssnanoConfig))
        }

        return gulp
          .src(paths.src)
          .pipe(gulpif(!global.production, sourcemaps.init()))
          .pipe(postcss(plugins))
          .pipe(gulpif(!global.production, sourcemaps.write()))
          .pipe(
            gulpif(
              global.production,
              purgecss({
                content: ['../../src/**/*.html', '../../src/**/*.js'],
                extractors: [
                  {
                    extractor: TailwindExtractor,
                    extensions: ['html', 'js']
                  }
                ]
              })
            )
          )
          .pipe(gulp.dest(paths.dest))
          .pipe(browserSync.stream())
      }
    }
  },

  browserSync: {
    server: {
      // should match `dest` in
      // path-config.json
      baseDir: "public"
    },
    open: false,
    ghostMode: false
  },

  production: {
    rev: true
  }
}
