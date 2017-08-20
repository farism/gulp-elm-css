module SharedCss exposing (..)

import Css exposing (..)
import Css.Namespace exposing (namespace)


type CssClasses
    = Container
    | Header


css =
    (stylesheet << namespace "shared")
        [ class Container
            [ margin zero
            , padding zero
            ]
        , class Header
            [ fontSize (px 50)
            ]
        ]
