import nib from 'nib';
import autoprefixer from 'autoprefixer-stylus';

import pngquant from 'imagemin-pngquant';
import mozjpeg from 'imagemin-mozjpeg';

import uglifyJsPlugin from 'uglifyjs-webpack-plugin';
import licenseInfoWebpackPlugin from 'license-info-webpack-plugin';

const convert = {
  linefeedcode: 'LF',// CRLF || LF || CR
  encode: {
    to: 'utf8'// https://github.com/ashtuchkin/iconv-lite#supported-encodings
  }
};

// development | production
const mode = 'development';
const lint = false;
const minify = false;

module.exports = {

  /* serv @browserSync */
  serv: {
    options: {
      notify: false,
      open: 'local',// argv.no = false(ex: gulp watch --no)
      startPath: '/',
      server: {
        baseDir: define.path.dist
      }
    }
  },

  /* html @pug */
  html: {
    src: define.path.src('pug', 'all'),
    dist: define.path.dist,
    extension: '.html',
    options: {
      basedir: define.path.htdocs,
      pretty: true
    },
    inheritance_options: {
      basedir: define.path.htdocs,
      skip: 'node_modules'
    },
    minify,
    // ex: https://github.com/kangax/html-minifier/
    minify_options: {
      empty: true,
      cdata: false,
      comments: true,
      conditionals: false,
      spare: true,
      quotes: true,
      loose: false
    },
    convert,

    lint,
    // ex: https://github.com/yaniswang/HTMLHint/wiki/Rules
    lint_options: {
      'tagname-lowercase': true,
      'attr-value-double-quotes': true,
      'doctype-first': true,
      'tag-pair': true,
      'spec-char-escape': true,
      'id-unique': true,
      'src-not-empty': true,
      'attr-no-duplication': true,
      'title-require': true,
      'space-tab-mixed-disabled': true,
      'inline-style-disabled': true,
      'alt-require': true
    },
    meta: '../../' + define.path.config + 'page',// relative path -> tasks/html.js
    assets_path: '/assets/',//base absolute path
    path_type: 'relative'// relative | absolute
  },

  /* css @stylus */
  css: {
    src: define.path.src('styl'),
    dist: define.path.dist,
    extension: '.css',
    options: {
      import: ['nib'],
      use: [
        nib(),
        autoprefixer(['last 2 versions', 'ie 8', 'ie 9', 'ios >= 7', 'android >= 2.3'])
      ]
    },
    minify,
    // ex: https://github.com/jakubpawlowicz/clean-css
    minify_options: {
      compatibility: 'ie9',
      format: {
        breaks: {
          afterComment: true
        }
      }
    },
    comb_options: './node_modules/csscomb/config/zen.json',
    convert,
    serv: 'stream',// stream or reload(default: reload)

    lint,
    // ex: https://github.com/CSSLint/csslint/wiki/Rules
    lint_options: {
      'display-property-grouping': true,
      'duplicate-properties': true,
      'duplicate-background-images': true,
      'empty-rules': true,
      'known-properties': true,
      'important': true,
      'zero-units': true,
      'regex-selectors': true,
      'import': true,
      'universal-selector': true,

      'ids': false,
      'star-property-hack': false,
      'underscore-property-hack': false,
      'compatible-vendor-prefixes': false,
      'unqualified-attributes': false,
      'outline-none': false,
      'font-sizes': false,
      'floats': false,
      'text-indent': false
    }
  },

  /* js @webpack */
  js: {
    src: define.path.src('js'),
    dist: define.path.dist,
    extension: '.js',
    options: {
      mode,

      performance: {
        hints: false
      },

      resolve: {
        modules: [
          path.resolve(__dirname, '../node_modules'),
          path.resolve(__dirname, '../' + define.path.config + 'node_modules'),
          'node_modules'
        ],
        extensions: ['.js', '.jsx', '.json', '.vue']
      },

      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader?cacheDirectory=true",
              options: {
                presets: [
                  ['@babel/preset-env', {modules: false, useBuiltIns: 'usage'}],
                  '@babel/preset-stage-0'
                ],
                plugins: ['@babel/plugin-transform-runtime']
              }
            }
          }
        ],
      },

      plugins: [
        new licenseInfoWebpackPlugin({
          glob: '{LICENSE,license,License}*'
        })
      ],
      optimization: {
        minimizer:
          argv.min || mode === 'production' ? [
            new uglifyJsPlugin({
              uglifyOptions: {
                output: {comments: /^\**!|@preserve|@license|@cc_on/}
              },
            }),
          ] : [],
      }
    },
    minify,// true => mode = 'production'
    // ex: https://github.com/mishoo/UglifyJS2#minify-options
    // minify_options: {},
    convert,

    lint,
    // ex: http://eslint.org/docs/rules/
    lint_options: {
      parser: 'babel-eslint',
      env: {
        'browser': true,
        'es6': true,
        'node': true
      },
      extends: 'eslint:recommended',
      rules: {
        'no-console': 1,
        'no-alert': 1,
        'default-case': 1
      },
      globals: [
        'jQuery',
        '$',
        '_'
      ]
    }
  },

  /* img @imagemin */
  img: {
    src: define.path.src('{jpg,jpeg,png,gif,svg}'),
    dist: define.path.dist,

    plugins: [
      pngquant({
        quality: '50-100'
      }),
      mozjpeg({
        quality:85,
        progressive: true
      }),
      $.imagemin.gifsicle(),
      $.imagemin.optipng(),
      $.imagemin.svgo()
    ],
    options: {
      interlaced: true,
      verbose: true,
      progressive: true,
      optimizationLevel: 7
    }
  },

  /* copy */
  copy: { // other filetype
    src: define.path.src('!(pug|styl|js|jsx|vue|tag|jpg|jpeg|png|gif|svg)'),
    dist: define.path.dist
  }

};
