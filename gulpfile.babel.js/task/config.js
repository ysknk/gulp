let meta = require(`../../${define.path.pageConfig}`);

module.exports = {
  /* run flg */
  tasks: {
    html: true,
    css: true,
    js: true,
    img: true,
    copy: true,
    serv: true
  },

  /* common set */
  common: {
    lint: false,// true || gulp --lint
    minify: false,// true || gulp --min

    ignore: define.path.ignore(),

    convert: {
      linefeedcode: 'LF',// CRLF || LF || CR

      replace: [// [{from: '', to: ''}]
        {from: '〜', to: '～'}
      ],
      find: [],// ['a', 'b']

      encode: {
        to: 'utf8'// https://github.com/ashtuchkin/iconv-lite#supported-encodings
      }
    },

    options: {
      // development | production || none
      mode: 'development'
    },

    htdocsdir: define.path.htdocs
  },

  /* serv @browserSync */
  serv: {
    src: [define.path.dest],
    options: {
      notify: false,
      open: 'local',// argv.no = false(ex: gulp watch --no)
      startPath: '/',
      server: {
        baseDir: define.path.dest
      }
    }
  },

  /* html @pug */
  html: {
    src: define.path.src('pug'),
    dest: define.path.dest,
    extension: '.html',

    options: {
      pretty: true
    },
    inheritance_options: {
      skip: 'node_modules'
    },

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
    lint_report_type: '',

    meta,
    assets_path: '/assets/',//base absolute path
    path_type: 'relative'// relative | absolute
  },

  /* css @stylus */
  css: {
    src: define.path.src('styl'),
    // src: define.path.src('styl', 'all'),
    dest: define.path.dest,
    extension: '.css',

    options: {
      import: ['nib'],
      rawDefine: {
        meta
      },
      define: {
        import_tree: import_tree
      },
      use: [
        nib()
      ]
    },
    autoprefixer_options: {
      browsers: ['last 2 versions', '> 2%'],
      cascade: false
    },

    // ex: https://github.com/jakubpawlowicz/clean-css
    minify_options: {
      compatibility: 'ie10',
      format: {
        breaks: {
          afterComment: true
        }
      }
    },
    comb_options: './node_modules/csscomb/config/zen.json',
    serv: 'stream',// stream or reload(default: reload)

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
    },
    lint_report_type: 'compact',
  },

  /* js @webpack */
  js: {
    src: define.path.src('js'),
    dest: define.path.dest,
    extension: '.js',
    options: {
      performance: {
        hints: false
      },

      stats: {
        assets: false,
        builtAt: false,
        entrypoints: false,
        errors: false
      },

      resolve: {
        modules: [
          path.resolve(__dirname, '../../node_modules'),
          path.resolve(__dirname, '../../' + define.path.config + 'node_modules'),
          'node_modules'
        ],
        extensions: ['.js', '.jsx', '.json', '.vue']
      },

      module: {
        rules: [
          {
            test: /\.(js|jsx|json|vue)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader?cacheDirectory=true",
              options: {
                presets: [
                  ['@babel/preset-env', {modules: false, useBuiltIns: 'usage'}]
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
      ]
    },

    // ex: https://github.com/mishoo/UglifyJS2#minify-options
    minify_options: {
      output: {comments: /^\**!|@preserve|@license|@cc_on/}
    },

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
    },
    // lint_report_type: './node_modules/eslint/lib/formatters/codeframe',
    lint_report_type: 'compact'
  },

  /* img @imagemin */
  img: {
    src: define.path.src('{jpg,jpeg,png,gif,svg}'),
    dest: define.path.dest,

    plugins: [
      pngquant({
        quality: '50-100'
      }),
      mozjpeg({
        quality: 85,
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
    dest: define.path.dest
  }

};
