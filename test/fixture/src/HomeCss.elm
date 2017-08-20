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
