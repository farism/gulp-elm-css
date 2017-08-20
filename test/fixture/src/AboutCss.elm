module AboutCss exposing (..)

import Css exposing (..)
import Css.Namespace exposing (namespace)


type CssIds
    = About


css =
    (stylesheet << namespace "about")
        [ id About
            [ backgroundColor (hex "FFFFFF")
            , color (hex "000000")
            ]
        ]
