import { WithTouchAction } from '@past3lle/carousel'
import { SmartVideoProps } from '@past3lle/components'
import { SkillLockStatus } from '@past3lle/forge-web3'
import { BLACK, ThemeSubModesRequired } from '@past3lle/theme'
import { getIsMobile as getIsMobileDevice } from '@past3lle/utils'
import { useBreadcrumb } from '@/components/Breadcrumb'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ClickCarousel, SwipeCarousel, type ProductSwipeCarousel } from '@/components/Carousel/ProductCarousels'
import { ProductCarousel } from '@/components/Carousel/ProductCarousels'
import { Z_INDEXES } from '@/constants/config'
import { FORGE_WEB3_ENABLED } from '@/constants/flags'
import { SingleProductScreen } from '@/components/Asides/skill/styled'
import Logo from '@/components/PagesComponents/components/Logo'
import { memo, useCallback } from 'react'
import { ThemeModes } from '@/theme'

import ProductPriceAndLabel from '../components/ProductPriceAndLabel'
import ProductRarityAndLabel from '../components/ProductRarityAndLabel'
import { useProductWebCarouselActions } from '../hooks/useProductCarouselActions'
import { ScrollingProductLabel } from '../styleds'
import { BaseScreensProps, WithContainerNode } from './types'

export type CarouselScreenProps = Omit<ProductCarousel, 'axis' | 'children' | 'animationProps'> &
  WithTouchAction &
  Pick<ReturnType<typeof useProductWebCarouselActions>, 'onChange'> &
  Pick<SmartVideoProps, 'videoProps'>
export interface AsideCarouselProps extends BaseScreensProps, WithContainerNode {
  carousel: CarouselScreenProps
  themeMode: ThemeSubModesRequired | 'DEFAULT'
  breadcrumbs: ReturnType<typeof useBreadcrumb> | null
  userAddress: `0x${string}` | undefined
  hidePrice?: boolean
  isCollectionView?: boolean
  logoCss?: string
}
const ITEM_LABEL_HEIGHT = 40
export default memo<AsideCarouselProps>(function AsideCarouselScreen({
  metaContent,
  palette,
  carousel,
  themeMode: mode,
  product,
  breadcrumbs,
  containerNode,
  skillInfo,
  userAddress,
  hidePrice,
  isCollectionView = false,
  logoCss,
}: AsideCarouselProps) {
  const { headerLogo, logo, navLogo } = metaContent
  const { bgColor, color } = palette
  const {
    data,
    touchAction,
    startIndex,
    imageProps,
    videoProps,
    onChange,
    onCarouselItemClick,
    indicatorOptions,
    ...restCarouselProps
  } = carousel

  const { shortDescription, title, variant } = product

  const Carousel = useCallback(
    (props: Omit<ProductSwipeCarousel, 'touchAction'>) =>
      getIsMobileDevice() ? (
        <SwipeCarousel {...props} touchAction={touchAction} />
      ) : (
        <ClickCarousel
          {...props}
          showButtons={!isCollectionView}
          onCarouselItemClick={onCarouselItemClick}
          onCarouselChange={onChange}
        />
      ),
    // Ignore onCarouselChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCarouselItemClick]
  )

  return (
    <SingleProductScreen>
      {/* Breadcrumbs */}
      {!!breadcrumbs?.breadcrumbs && (
        <ScrollingProductLabel height={ITEM_LABEL_HEIGHT} logo={headerLogo} padding={'0.25rem'} flexDirection="column">
          <Breadcrumbs lastCrumb={breadcrumbs?.lastCrumb} breadcrumbs={breadcrumbs.breadcrumbs} color={bgColor} />
        </ScrollingProductLabel>
      )}
      {/* Product carousel */}
      <Carousel
        {...restCarouselProps}
        axis="x"
        data={data}
        startIndex={startIndex}
        colors={{ accent: color || BLACK, ...restCarouselProps.colors }}
        imageProps={imageProps}
        videoProps={videoProps}
        indicatorOptions={{
          showIndicators: true,
          position: 'top',
          ...indicatorOptions,
          barStyles: `
            filter: invert(1);
            width 100%;
            height: 5px;
            gap: 0rem;
            z-index: ${Z_INDEXES.MODALS + 1};
            top: ${isCollectionView ? '0.25%' : ITEM_LABEL_HEIGHT - 2 + 'px'};
            ${indicatorOptions?.barStyles}
          `,
        }}
      />
      {/* DYNAMIC LOGO */}
      <Logo
        logoCss={
          logoCss ??
          `
            filter: ${
              mode === ThemeModes.DARK
                ? `invert(1) saturate(1.4) hue-rotate(180deg) drop-shadow(0px 3px 7px ${bgColor})`
                : `drop-shadow(0px 5px 5px ${bgColor})`
            };
          `
        }
        parentNode={containerNode}
        isCollectionView={isCollectionView}
        logos={{ header: headerLogo, nav: navLogo, main: logo }}
      />
      {!hidePrice && (
        <ProductPriceAndLabel variant={variant} color={color} title={title} shortDescription={shortDescription} />
      )}
      {skillInfo !== null && FORGE_WEB3_ENABLED && (
        <ProductRarityAndLabel
          lockStatus={skillInfo.lockStatus}
          variant={variant}
          title={`RARITY: ${skillInfo.metadata?.properties.rarity.toUpperCase() || 'COMMON'}`}
          shortDescription={
            skillInfo.lockStatus === SkillLockStatus.LOCKED
              ? !userAddress
                ? 'SKILL LOCKED - LOGIN TO VERIFY STATUS'
                : 'SKILL LOCKED - VIEW PREREQUISITES IN THE FORGE'
              : 'UNLOCKED! READ MORE IN THE FORGE SKILLBOOK'
          }
        />
      )}
    </SingleProductScreen>
  )
})
