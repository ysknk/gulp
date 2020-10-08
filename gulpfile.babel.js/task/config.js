const meta = require(`../../${define.path.pageConfig}`);
const eslintrc = require(`../../${define.path.srcDir}.eslintrc.js`);

const base_dir = {
  html: `html/`,
  css: `css/`,
  js: `js/`,
  img: `img/`,
  copy: `copy/`,
};

module.exports = {
  /* run flg */
  tasks: {
    html: true,
    css: true,
    js: true,
    img: true,
    copy: true,
    delete: true,
    serv: true
  },

  /* common set */
  common: {
    lint: false,// true || gulp --lint
    minify: false,// true || gulp --min
    delete: false,// true || gulp --del

    dist: ``,
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

    htdocsdir: define.path.htdocs,

    serv: 'reload'
  },

  /* serv @browserSync */
  serv: {
    src: [define.path.dest],
    options: {
      notify: false,
      open: 'local',// argv.no = false(ex: gulp watch --no)
      startPath: '/',
      reloadDelay: 100,
      server: {
        baseDir: define.path.dest
      }
    }
  },

  /* html @pug */
  html: {
    // src: define.path.src('pug'),
    src: [`${define.path.srcDir}htdocs/${base_dir.html}**/*.pug`],
    dest: define.path.dest,
    base_dir: base_dir.html,

    extension: '.html',
    is_config_build: true,

    options: {
      pretty: true
    },

    inheritance_options: {
      // debug: true,
      skip: 'node_modules',
      saveInTempFile: true,
      tempFile: `${define.path.srcDir}.pugInheritance.json`
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
    root_path: '/',//base absolute path
    path_type: 'relative'// relative | absolute
  },

  /* css @stylus */
  css: {
    // src: define.path.src('styl'),
    src: [`${define.path.srcDir}htdocs/${base_dir.css}**/*.styl`],
    dist: `assets/css/`,
    dest: define.path.dest,
    base_dir: base_dir.css,

    extension: '.css',

    options: {
      import: ['nib'],
      rawDefine: {
        meta
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
    // src: define.path.src('{js,jsx,ts,tsx,vue}'),
    src: [`${define.path.srcDir}htdocs/${base_dir.js}**/*.{js,jsx,ts,tsx,vue}`],
    dist: `assets/js/`,
    dest: define.path.dest,
    base_dir: base_dir.js,

    // ignore: define.path.ignore('{d\.ts}'),
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
          path.resolve(__dirname, `../../${define.path.srcDir}node_modules`),
          'node_modules'
        ],
        extensions: ['.json', '.jsx', '.js', '.vue', '.tsx', '.ts']
      },

      module: {
        rules: [
          {
            test: /\.(js|jsx|json|vue)$/,
            exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
            use: {
              loader: 'babel-loader?cacheDirectory=true',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    targets: '> 0.25%, not dead',
                    useBuiltIns: 'usage',
                    corejs: 3,
                    // debug: true,
                  }]
                ]
              }
            }
          },
          {
            test: /\.(txt|glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'raw-loader'
              },
              {
                loader: 'glslify-loader'
              }
            ]
          },
          {
            test: /(?<!\.d)\.tsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'ts-loader',
              // ex: https://www.typescriptlang.org/docs/handbook/compiler-options.html
              options: {
                configFile: path.resolve(__dirname, `../../${define.path.srcDir}tsconfig.json`),
                compilerOptions: {
                  module: 'commonjs',
                  lib: ['es2019', 'dom', 'dom.iterable'],
                  jsx: 'react',

                  sourceMap: false,

                  incremental: true,
                  removeComments: false,
                  downlevelIteration: true,
                  strict: true,
                  moduleResolution: 'node',
                  forceConsistentCasingInFileNames: true,

                  noImplicitAny: false,
                  strictNullChecks: false,
                  strictFunctionTypes: false,
                  strictBindCallApply: false,
                  strictPropertyInitialization: false,
                  noImplicitThis: false,

                  noEmitOnError: true,
                  noUnusedLocals: false,
                  noUnusedParameters: false
                }
              }
            }
          }
        ],
      },

      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          meta: {
            p: JSON.stringify(meta.p)
          }
        }),
        new licenseInfoWebpackPlugin({
          glob: '{LICENSE,license,License}*'
        })
      ]
    },

    // ex: https://github.com/mishoo/UglifyJS2#minify-options
    minify_options: {
      cache: true,
      parallel: true,
      uglifyOptions: {
        output: {comments: /^\**!|@preserve|@license|@cc_on/}
      }
    },

    // ex: http://eslint.org/docs/rules/
    lint_options: {
      ...eslintrc,
      globals: Object.keys(eslintrc.globals),
    },
    // lint_report_type: './node_modules/eslint/lib/formatters/codeframe',
    lint_report_type: 'compact'
  },

  /* img @imagemin */
  img: {
    // src: define.path.src('{jpg,jpeg,png,gif,svg}'),
    src: [`${define.path.srcDir}htdocs/${base_dir.img}**/*.{jpg,jpeg,png,gif,svg}`],
    dist: `assets/img/`,
    dest: define.path.dest,
    base_dir: base_dir.img,

    plugins: [
      imageminPngquant({
        quality: [0.5, 1.0]
      }),
      imageminMozjpeg({
        quality: 85,
        progressive: true
      }),
      imageminGifsicle(),
      imageminOptipng(),
      imageminSvgo({
        plugins: [
          {removeViewBox: false}
        ]
      })
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
    // src: define.path.src('!(pug|styl|js|jsx|vue|tag|jpg|jpeg|png|gif|svg|d.ts|ts|tsx)'),
    src: [`${define.path.srcDir}htdocs/${base_dir.copy}**/*.*`],
    dest: define.path.dest,
    base_dir: base_dir.copy,
  },

  /* delete */
  delete: { // all
    src: `${define.path.dest}`,
    // dest: define.path.dest
  }

};

