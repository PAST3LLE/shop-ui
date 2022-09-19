export type Color = string
export interface Colors {
  // base
  white: Color
  offWhite: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color
  textDisabled: Color

  // backgrounds / greys
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bgDisabled: Color

  modalBG: Color
  advancedBG: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  green1: Color
  green2: Color
  yellow1: Color
  yellow2: Color
  blue1: Color
  purple: Color
  purple1: Color
  purple2: Color

  // states
  dangerLight: Color
  warningLight: Color
}

export enum ThemeModes {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  // add whatever themes u want here...
  VAMPIRE = 'VAMPIRE',
  CHAMELEON = 'CHAMELEON'
}

export type Theme = {
  mode: ThemeModes
  autoDetect: boolean
}

export const THEME_LIST = Object.entries(ThemeModes)

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    // theming
    mode: ThemeModes
    buttons: {
      font: {
        size: {
          small: string
          normal: string
          large: string
        }
      }
      borderRadius: string
      border: string
    }
    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
      upToExtraLarge: ThemedCssFunction<DefaultTheme>
    }

    // from media size
    fromMediaWidth: {
      fromExtraSmall: ThemedCssFunction<DefaultTheme>
      fromSmall: ThemedCssFunction<DefaultTheme>
      fromMedium: ThemedCssFunction<DefaultTheme>
      fromLarge: ThemedCssFunction<DefaultTheme>
      fromExtraLarge: ThemedCssFunction<DefaultTheme>
    }

    // between media size
    betweenMediaWidth: {
      betweenExtraSmallAndSmall: ThemedCssFunction<DefaultTheme>
      betweenSmallAndMedium: ThemedCssFunction<DefaultTheme>
      betweenMediumAndLarge: ThemedCssFunction<DefaultTheme>
      betweenLargeAndExtraLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
