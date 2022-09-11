import styled from 'styled-components/macro'
import { transparentize } from 'polished'

import { Column, Row } from 'components/Layout'
import { DEFAULT_IK_TRANSFORMS, Z_INDEXES } from 'constants/config'
import { fadeInAnimation, ItemHeader, Strikethrough } from 'pages/SingleItem/styleds'
import { fromExtraLarge, upToSmall } from 'theme/utils'
import { ProductBrandingAssets } from 'shopify/graphql/types'
export const CartLineContent = styled(Row)`
  display: grid;
  // span, pic, content
  grid-template-columns: auto min-content;
  background: ${({ theme }) => theme.purple1};
  padding: 1rem;
`

export const CartLineWrapper = styled(Row)<{
  brandAssetMap: Partial<ProductBrandingAssets> | undefined
  color?: string
}>`
  border-radius: 1rem;
  > div {
    display: grid;
    // span, pic, content
    grid-template-columns: 0px 12rem auto;
    text-align: center;
    max-height: 14rem;
    width: 100%;
  }

  background: ${({ theme, brandAssetMap, color }) =>
    brandAssetMap?.header
      ? `url(${brandAssetMap?.header}?tr=${DEFAULT_IK_TRANSFORMS.HQ_LOGO}) center repeat, url(${brandAssetMap?.header}?tr=${DEFAULT_IK_TRANSFORMS.LQ_LOGO}) center repeat`
      : color || transparentize(0.3, theme.bg1)};

  background-color: ${({ theme, color = transparentize(0.3, theme.bg1) }) => color};
  background-size: initial;
  background-blend-mode: unset;

  border-top: 1px solid black;

  padding: 1rem;

  img {
    max-width: 100%;
  }

  input[type='number'] {
    min-width: unset;
    width: 5rem;
  }

  > div {
  }
`

export const ShoppingCartQuantityWrapper = styled(Row)`
  padding: 0.2rem 0.4rem;
  border-radius: 2rem;
  background-color: ${({ theme }) => theme.purple1};
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
`

export const ShoppingCartWrapper = styled(Row)`
  justify-content: space-evenly;
  gap: 1rem;
  background: ${({ theme }) => theme.offWhite};
  padding: 2rem;
  margin-left: auto;
  width: fit-content;
  border-radius: 0.5rem;
  cursor: pointer;

  > svg,
  > ${ShoppingCartQuantityWrapper} {
    flex: 1 1 50%;
  }

  > svg {
    color: ${({ theme }) => theme.black};
  }
`

export const ShoppingCartPanelContentWrapper = styled(Column)`
  overflow: hidden;
  overflow-y: auto;
  > ${Row} {
    &:first-child {
      display: grid;
      grid-template-columns: min-content 1fr min-content;
      grid-gap: 9rem;
    }
    margin: 1rem 0;

    > ${Strikethrough} {
      border-radius: 2rem;
      height: 0.5rem;
    }

    > ${ItemHeader} {
      letter-spacing: -10px;
    }

    > svg {
      margin: 0 2rem;
      cursor: pointer;
    }
  }
`

export const ShoppingCartPanelWrapper = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: ${Z_INDEXES.SHOPPING_CART};
  cursor: initial;

  // animation
  filter: contrast(1) blur(0px);
  ${fadeInAnimation};
  animation-name: fadeIn;
  animation-duration: 0.4s;

  > ${ShoppingCartPanelContentWrapper} {
    color: ${({ theme }) => theme.text1};
    // background: ${({ theme }) => transparentize(0.2, theme.black)};
    background-color: ${({ theme }) => transparentize(0.1, theme.black)};
    padding: 0 4rem 0rem;
    margin-left: auto;
    width: 80%;
    height: 100%;

    ${upToSmall`
      width: 100%;
    `}

    ${fromExtraLarge`
      width: 40%;
    `}
  }
`