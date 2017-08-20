port module Stylesheets exposing (..)

import Css.File exposing (CssFileStructure, CssCompilerProgram)
import AboutCss
import HomeCss
import SharedCss


port files : CssFileStructure -> Cmd msg


fileStructure : CssFileStructure
fileStructure =
    Css.File.toFileStructure
        [ ( "1.css", Css.File.compile [ SharedCss.css ] )
        , ( "2.css", Css.File.compile [ HomeCss.css ] )
        , ( "3.css", Css.File.compile [ AboutCss.css ] )
        ]


main : CssCompilerProgram
main =
    Css.File.compiler files fileStructure
