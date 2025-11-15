import { PNG_LogoFull_2x, PNG_LogoShort_2x } from '@past3lle/assets'
import { Header, Row, RowFixed } from '@past3lle/components'
import {
  BLACK,
  OFF_WHITE,
  betweenSmallAndMedium,
  fromExtraSmall,
  fromMedium,
  setBackgroundWithDPI,
  setBestTextColour,
  upToExtraSmall,
  upToSmall,
  upToSmallHeight,
} from '@past3lle/theme'
import { YellowCard } from '@/components/Layout/Card'
import { MobileNavOrb } from '@/components/Navigation/styled'
import { ShoppingCartFullWrapper, ShoppingCartHeaderWrapper } from '@/components/ShoppingCart/styled'
import ThemeToggleBar from '@/components/ThemeToggler'
import { Web3Button } from '@/components/Web3LoginButton'
import { Z_INDEXES } from '@/constants/config'
import { FreeShippingBanner, ProductSubHeader } from '@/components/PagesComponents/styleds'
import { darken, transparentize } from 'polished'
import { Text } from 'rebass'
import styled from 'styled-components/macro'
import { getThemeColourByKey } from '@/theme'
import { ThemeModes } from '@/theme'
import { ShopImageSrcSet } from '@/types'
import Link from 'next/link'

// weird bug with next thinking static
const logoFull = PNG_LogoFull_2x as unknown as string
const logoShort = PNG_LogoShort_2x as unknown as string

const DEFAULT_BG = transparentize(0.3, getThemeColourByKey(ThemeModes.DARK, 'bg1', BLACK) as string)

export const HeaderH1 = styled.h1`
  font-size: 0.9rem;
  margin: 0;
  font-variation-settings: 'wght' 350;
  > span {
    font-size: inherit;
    font-variation-settings: 'wght' 800;
    display: inline-block;
  }
`
export const StyledNavLink = styled(Link)`
  display: flex;
  flex-flow: row nowrap;
  align-items: left;
  border-radius: ${({ theme }) => theme.button.border.radius};
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: ${({ theme }) => theme.button.fontSize.normal};
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const BalanceText = styled(Text)`
  font-weight: 500;
  padding: 0 6px 0 12px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    overflow: hidden;
    max-width: 100px;
    text-overflow: ellipsis;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`

export const HeaderElement = styled.div`
  background: ${OFF_WHITE};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.button.border.radius};
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Title = styled(Link)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;

  :hover {
    cursor: pointer;
  }
`

export const StyledThemeToggleBar = styled(ThemeToggleBar)``
export const HeaderRow = styled(RowFixed)`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(7.5rem, 16rem) 11rem auto min-content min-content;
  grid-gap: 1rem;
  z-index: 1;

  ${Title} {
    height: 75%;
    width: 100%;
  }

  > ${Web3Button}, > ${Row}#cart-shipping-banner {
    height: 92%;
  }

  > ${Row}#cart-shipping-banner {
    white-space: nowrap;
    > ${FreeShippingBanner}, > ${Web3Button} {
      background-color: #332f31bf;
    }
  }

  > ${Row}#cart-shipping-banner {
    > ${FreeShippingBanner} {
      min-width: 14.2rem;
      background-color: #332f31bf;
    }
    > ${ShoppingCartFullWrapper} > ${ShoppingCartHeaderWrapper} {
      background-color: ${({ theme }) => (theme.mode === ThemeModes.DARK ? 'rgb(128 80 242 / 52%)' : '#e19bb5d9')};
    }
    > ${FreeShippingBanner} {
      color: ${(props) => props.theme.content.text};
      > svg {
        stroke: ${(props) => props.theme.content.text};
      }
    }
  }

  > ${StyledThemeToggleBar} {
    display: none;
  }

  > ${Web3Button} {
    width: min-content;
    max-width: 19rem;
    justify-self: flex-end;
  }

  ${upToExtraSmall`
    > ${MobileNavOrb} {
      padding: 0;
      margin-left: auto;
    }

    > ${Row}#cart-shipping-banner > ${FreeShippingBanner} {
      display: none;
    }
  `}

  ${upToSmall`
    grid-template-columns: 8rem auto min-content min-content;
    gap: 0.5rem;
    > ${Web3Button}, > ${Row}#cart-shipping-banner {
      height: 80%;
    }
  `}

  ${fromMedium`
      grid-template-columns: minmax(10rem, 16rem) auto max-content;
      > ${Row}#cart-shipping-banner {
        svg {
          max-width: 2rem;
        }
        > ${ShoppingCartFullWrapper} {
          > ${ShoppingCartHeaderWrapper} {
            width: 100%;
            padding: 0.5rem 2rem;
            > svg {
              max-width: 2.5rem;
            }
          }
        }
      }
      nav {
        display: none;
      }
  `};

  ${betweenSmallAndMedium`
      grid-template-columns: minmax(10rem, 16rem) 11rem auto min-content min-content;
      
      > ${Web3Button}, > ${Row}#cart-shipping-banner {
        height: 70%;
      }

      > ${StyledThemeToggleBar} {
        display: flex;
        max-width: 11rem;
      }
  `}
`

export const HeaderDrawerButton = styled.div`
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(267deg, ${({ theme }) => theme.blackOpaqueMore} 13%, transparent);
  padding: 0 2rem;
  font-size: 2vw;
  cursor: pointer;

  > ${ProductSubHeader} {
    color: white;
  }
`
export const HeaderFrame = styled(Header)<{
  open: boolean
  color?: string | undefined | null
  css?: string
  logoSet?: ShopImageSrcSet
}>`
  top: 0;
  padding: 1rem;

  ${upToSmall`
    padding: 0.3rem 0.5rem;
  `}

  z-index: ${Z_INDEXES.HEADER};

  ${({ theme, color = BLACK, logoSet }) =>
    logoSet &&
    setBackgroundWithDPI(theme, logoSet, {
      preset: 'header',
      modeColours: [color, BLACK],
    })}

  // HIDE HEADER ON SMALL HEIGHT LANDSCAPE BOIS
  ${({ open }) => upToSmallHeight`
    height: ${open ? 'initial' : '2.4rem'};
    overflow: ${open ? 'unset' : 'hidden'};

    > ${HeaderDrawerButton} {
      display: flex;
      height: ${!open ? '100%' : 'unset'};
      align-items: center;
      text-align: right;
    }
    
    > ${HeaderRow} {
      display: ${open ? 'grid' : 'none'};

      > ${Row} > ${ShoppingCartFullWrapper}, > ${MobileNavOrb} {
        margin-bottom: 2rem;
      }
    }
  `}

  transition: left 0.2s ease-in-out, height 0.2s ease-in-out;

  ${({ css }) => css}
`

export const HeaderLinks = styled(Row)<{ color?: string | null }>`
  width: max-content;
  margin-right: auto;
  justify-content: center;
  padding: 1rem;

  border-radius: 0.5rem;
  background-color: ${({ color }) => (color ? darken(0.03, color) : DEFAULT_BG)};

  > a {
    color: ${({ color }) => setBestTextColour(color || DEFAULT_BG, 2, true)};
    white-space: nowrap;
    flex: 1 0 auto;

    font-size: 2rem;
    font-weight: 300;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: auto;
    > a {
      font-size: 1.5rem;
    }
  `};
`

export const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;

  border-radius: ${({ theme }) => theme.button.border.radius};
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
  } */
`

export const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
 `};
`

export const NetworkCard = styled(YellowCard)`
  border-radius: ${({ theme }) => theme.button.border.radius};
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

export const Pastellecon = styled.div.attrs({ alt: 'Brand Logo - Pastelle Apparel' })`
  height: 100%;
  width: 100%;
  transition: transform 0.3s ease;

  background: url(${logoShort}) left/contain no-repeat;
  ${fromExtraSmall`
    background: url(${logoFull}) left/contain no-repeat;
    height: 120%;
    width: 120%;
  `}

  &:hover {
    transform: rotate(-5deg);
  }
`
