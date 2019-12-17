Gulp Starter Kit
====

website build tools.  
use submodule add or clone.  

## Description

* Pug -> html
* Stylus(+nib) -> css
* js(webpack+Babel) -> js
* img(imagemin) -> img
* other(copy) -> other

## Requirement

* Node.js
* gulp-cli(npm global install)

## Install

### submodule add

```Shell
git submodule add https://github.com/ysknk/gulp-starter-kit _app
cd _app/
git submodule add https://github.com/ysknk/gulp-starter-src _src
npm i
```

### clone

```Shell
git clone https://github.com/ysknk/gulp-starter-kit _app
cd _app/
git clone https://github.com/ysknk/gulp-starter-src _src
npm i
```

### Directory before installation

    [root/]
      |-[_app/]

### Directory after installation

    [root/]
      |-[_app/] *submodule
      |   |-[_src/] *submodule in submodule
      |
      |-[_src/]
      |   |-[config/]
      |   |   |-[task/] *task config (master_data: /gulpfile.babel.js/task/config.js)
      |   |   |-[tasks/] *original task
      |   |   |-[page.js] *pug, styl variables
      |   |-[htdocs/] *work directory
      |
      |-[html/] *default dest directory

## Usage

### npm-scripts

```Shell
cd $(root)/_app/
# watch target files and server open
npm run watch
# not browser open
npm run watch -- --no
# compile all target files
npm run build
# lint all target files
npm run lint
# clean all target files
npm run clean
# delete dest directory
npm run delete
    .
    .
    .
```

### Gulp command

```Shell
cd $(root)/_app/
# watch target files and server open
gulp watch
# deafult watch
gulp
# not browser open
gulp --no
# compile all target files
gulp build
# lint all target files
gulp lint
# clean all target files
gulp clean
# delete dest directory
gulp delete

# build target [task]
gulp [html|css|js|img]
# watch target [task] files and server open
gulp [html|css|js|img]:watch
# compile all target [task] files
gulp [html|css|js|img]:build
# lint all target [task] files
gulp [html|css|js|img]:lint
# clean all target [task] files
gulp [html|css|js|img]:clean
    .
    .
    .
```

#### Check other tasks.

```Shell
gulp --tasks
```

#### Custom task

Default Custom tasks

```Shell
cd $(root)/_app

# node-aigis
gulp styleguide
# gulp-iconfont
gulp iconfont
```
___* Gulp command only___

##### Mock API Server

```Shell
# mock api server
cd $(root)/_src/config
npm run jsonserver
```

## License

Licensed under MIT  
Copyright (c) 2018 [ysknk](https://github.com/ysknk)  

## Author

[ysknk](https://github.com/ysknk)

