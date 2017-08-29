# gulp-elm-css [![Circle CI](https://circleci.com/gh/farism/gulp-elm-css/tree/master.svg?style=svg)](https://circleci.com/gh/farism/gulp-elm-css/tree/master)

[![Greenkeeper badge](https://badges.greenkeeper.io/farism/gulp-elm-css.svg)](https://greenkeeper.io/)

Given an `*.elm` file, it will use [`elm-css`](https://github.com/rtfeldman/elm-css) to generate `*.css` files. A vinyl object will be emitted for each `*.css` file that is generated.

#### Usage

```js
const elmCss = require('gulp-elm-css')

gulp.src('Css.elm')
  .pipe(elmCss({ module: 'Css.elm' }))
```

#### Options
```js
options = {
  cwd: process.cwd() // (optional) the root directory of your elm project
  module: 'Stylesheets' // (optional) name of stylesheets module
  output: '' // (optional) the tmp path to output css files to
  port: 'files' // (optional) name of the port from which to read CSS results
}
```

#### Example

on the elm side

```elm
-- HomeCss.elm

module HomeCss exposing (..)

import Css exposing (..)
import Css.Namespace exposing (namespace)


type CssIds
    = Home


css =
    (stylesheet << namespace "home")
        [ id Home
            [ backgroundColor (hex "000000")
            , color (hex "FFFFFF")
            ]
        ]

```
```elm
-- MyStyles.elm

port module MyStyles exposing (..)

import Css.File exposing (CssFileStructure, CssCompilerProgram)
import AboutCss
import HomeCss
import SharedCss


port files : CssFileStructure -> Cmd msg


fileStructure : CssFileStructure
fileStructure =
    Css.File.toFileStructure
        [ ( "shared.css", Css.File.compile [ SharedCss.css ] )
        , ( "home.css", Css.File.compile [ HomeCss.css ] )
        , ( "about.css", Css.File.compile [ AboutCss.css ] )
        ]


main : CssCompilerProgram
main =
    Css.File.compiler files fileStructure

```

on the gulp side

```js
const elmCss = require('gulp-elm-css')

gulp.task('compile-css', () => {
  return gulp.src('MyStyles.elm')
    .pipe(elmCss({ module: 'MyStyles '}))
    .pipe(cssnano())
    .pipe(gulp.dest('build'))
})
```
