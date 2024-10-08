import { StyledCarouselContainer, StyledCarouselItemContainer } from '@past3lle/carousel'
import { Button, Column, Row } from '@past3lle/components'
import {
  BLACK,
  OFF_BLACK as CHARCOAL_BLACK,
  betweenSmallAndLarge,
  fromExtraLarge,
  fromLarge,
  fromSmall,
  setAnimation,
  setBackgroundWithDPI,
  upToSmall,
  upToSmallHeight,
} from '@past3lle/theme'
import { ArticleFadeInContainer } from '@/components/Layout/Article'
import { FIXED_IMAGE_SIZE_CONSTRAINTS, SINGLE_ITEM_LOGO_RATIO, STORE_IMAGE_SIZES } from '@/constants/config'
import {
  BASE_FONT_SIZE,
  LAYOUT_REM_HEIGHT_MAP,
  SINGLE_PRODUCT_LOGO_MARGIN_TOP_OFFSET,
  SIZE_RATIOS,
} from '@/constants/sizes'
import {
  ProductAsidePanel,
  ProductContainer,
  ProductLogo,
  ProductLogoCssImport,
  ProductScreen,
  ProductScreensContainer,
} from '@/components/PagesComponents/styleds'
import { darken, transparentize } from 'polished'
import styled from 'styled-components/macro'
import { ThemeModes } from '@/theme'
import { simmerAnimationCallback } from '@/theme/animation'
import { ShopImageSrcSet } from '@/types'

const PRICE_LABEL_PX =
  (LAYOUT_REM_HEIGHT_MAP.PRICE_LABEL + LAYOUT_REM_HEIGHT_MAP.FIXED_ADD_TO_CART_BUTTON) * BASE_FONT_SIZE

export const SingleProductArticle = styled(ArticleFadeInContainer)`
  ${upToSmall`
    position: fixed;
    height: calc(100% - 8rem);
    bottom: 0;
  `}
`

export const SingleProductAsidePanel = styled(ProductAsidePanel)``

export const AddToCartButtonWrapper = styled(Row)<{ isInView?: boolean; width?: string }>`
  position: fixed;
  bottom: 0.5rem;
  left: 0;
  width: ${({ width = '90%' }) => `calc(${width} - 1rem)`};
  height: ${LAYOUT_REM_HEIGHT_MAP.FIXED_ADD_TO_CART_BUTTON}rem;
  margin: 0 auto;

  ${Button} {
    width: 93%;
    height: 82%;
    margin: auto;
    box-shadow: 4px 3px 1px #605a3e7d;

    &:hover {
      transform: translate3d(4px, 4px, 0px);
      box-shadow: 0 0 0 !important;
    }

    transition:
      box-shadow 0.3s ease-in-out,
      transform 0.2s ease-in-out;
  }
  align-items: stretch;
  justify-content: stretch;

  z-index: 999;

  opacity: ${({ isInView }) => (isInView ? 0 : 1)};

  transition:
    height 0.3s ease-out,
    opacity 0.3s ease-out;
`

export const SingleProductScreen = styled(ProductScreen)`
  ${upToSmall`
    > ${Column} {
      padding: 0 1rem;
    }
  `}

  ${upToSmallHeight`
    height: 100%;
  `}

  > ${StyledCarouselContainer} {
    min-height: 443px;

    ${StyledCarouselItemContainer} {
      height: 100%;

      picture {
        height: 100%;
        img {
          max-width: 100%;
        }
      }
    }
  }
`

export const SingleProductContainer = styled(ProductContainer)<{ parentAspectRatio?: number }>`
  ${({ parentAspectRatio }) =>
    parentAspectRatio &&
    parentAspectRatio < SIZE_RATIOS[169].landscape * 0.85 &&
    betweenSmallAndLarge`
      height: calc(100% * 9 / 16 * 1.35);
      margin: auto !important;
    `}
`

// wraps all the single product page "screens" e.g carousel + label // showcase // descriptions
export const SingleProductScreensContainer = styled(ProductScreensContainer)<{
  bgColor?: string | null
  navLogo?: ShopImageSrcSet
  logo?: ShopImageSrcSet
  $calculatedSizes: { width?: number; height?: number }
}>`
  max-width: ${STORE_IMAGE_SIZES.SMALL}px;
  box-shadow: 1rem 0px 5rem 0.5rem ${({ theme }) => transparentize(0.5, theme.black)};

  // corresponds with @supports not above in itemAsidePanel
  @supports (overflow: clip) {
    overflow-x: clip;
  }

  // MOBILE SIZE
  max-width: 100%;
  min-width: unset;

  ${ProductLogo} {
    width: 100%;
    margin-top: -${SINGLE_PRODUCT_LOGO_MARGIN_TOP_OFFSET * 100}%;

    // for mobile logos in single
    &${ProductLogoCssImport}:not(div#product-logo__description) {
      margin-top: -15.4%;
    }
    // padding-top: 2rem;
    filter: ${({ theme }) => theme.modeLogoFilter};

    > img {
      margin: 0;
    }
  }

  ${StyledCarouselContainer} {
    height: ${({ $calculatedSizes: { height: asideContainerHeight, width: asideContainerWidth } }) =>
      asideContainerHeight && asideContainerWidth && _getOffsetHeight(asideContainerHeight, asideContainerWidth)}px;
  }

  ${upToSmall`
    > ${SingleProductScreen} {
      padding-left: 0;
      padding-right: 0;
    }
  `}

  ${fromSmall`
    width: 40vw; 
  `}

  ${({ $calculatedSizes: { height: asideContainerHeight, width: asideContainerWidth } }) => betweenSmallAndLarge`
    // 16 9 view
    ${StyledCarouselContainer} {
      height: ${
        asideContainerHeight &&
        asideContainerWidth &&
        _getOffsetHeight(asideContainerHeight, asideContainerWidth, LAYOUT_REM_HEIGHT_MAP.PRICE_LABEL * BASE_FONT_SIZE)
      }px;
    }
  `}

  ${fromLarge`
    width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromLarge}; 

    ${SingleProductScreen}:first-of-type {
      height: calc(100vh - ${LAYOUT_REM_HEIGHT_MAP.HEADER}rem);
    }

    ${ProductLogo}:not(#product-logo__description) {
      width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromLarge};
    }
  `}

  ${fromExtraLarge`
    max-width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromExtraLarge};
    ${SingleProductScreen}:first-of-type {
      height: calc(100vh - ${LAYOUT_REM_HEIGHT_MAP.HEADER}rem);
    }

    ${ProductLogo}:not(#product-logo__description) {
      width: ${FIXED_IMAGE_SIZE_CONSTRAINTS.fromExtraLarge};
    }
  `}

  ${upToSmallHeight`
    // height: 100%;
    > ${SingleProductScreen}:first-of-type {
      height: 100%;
    }
  `}
      
  ${({ theme, bgColor, navLogo }) =>
    navLogo
      ? setBackgroundWithDPI(theme, navLogo, {
          ignoreQueriesWithFixedWidth: 960,
          backgroundAttributes: ['center / cover no-repeat', '36px / cover repeat'],
          backgroundBlendMode: 'difference',
          modeColours: [bgColor || BLACK, CHARCOAL_BLACK],
        })
      : `background: linear-gradient(${bgColor || BLACK} 30%, ${transparentize(0.3, theme.white)} 55%);`}
  
  ${({ theme: { mode }, bgColor }) =>
    setAnimation(simmerAnimationCallback(darken(mode === ThemeModes.DARK ? 0.4 : 0, bgColor || BLACK)), {
      name: 'simmer' as Parameters<typeof setAnimation>[1]['name'],
      state: true,
      duration: 20,
      count: 20,
    })}
`

function _getOffsetHeight(asideContainerHeight: number, containerWidth: number, optionalHeight = PRICE_LABEL_PX) {
  const marginOffset = containerWidth * SINGLE_PRODUCT_LOGO_MARGIN_TOP_OFFSET
  const logoHeight = (containerWidth * SINGLE_ITEM_LOGO_RATIO[0]) / SINGLE_ITEM_LOGO_RATIO[1] - marginOffset

  const amount = asideContainerHeight - logoHeight - optionalHeight

  return amount
}

// min-height: ${({ $calculatedSizes: { width: asideContainerWidth } }) =>
//   asideContainerWidth ? asideContainerWidth * (1 + SINGLE_PRODUCT_LOGO_MARGIN_TOP_OFFSET) : asideContainerWidth}px;
