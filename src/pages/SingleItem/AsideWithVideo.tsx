import { useEffect, useMemo, useState } from 'react'

import { Column, Row } from 'components/Layout'
import ButtonCarousel from 'components/Carousel/ButtonCarousel'
import { ScrollableContentComponentBaseProps } from 'components/ScrollingContentPage'
import SmartImg from 'components/SmartImg'
import {
  ItemContainer,
  ItemAsidePanel,
  ItemLogo,
  ItemDescription,
  ItemCredits,
  ItemArtistInfo,
  PASTELLE_CREDIT,
  ItemSubHeader,
  InnerContainer,
  HighlightedText,
  ItemLogoCollectionView,
  InnerCollectionContainer,
  ItemContentContainer,
  ItemLogoCssImport,
  FreeShippingBanner,
  ScrollingProductLabel,
  ItemBackendDescription
} from './styleds'

import { useBreadcrumb } from 'components/Breadcrumb'
import { useCloseModals, useModalOpen, useToggleModal } from 'state/modalsAndPopups/hooks'
import { useUpdateCurrentlyViewing } from 'state/collection/hooks'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'
import { useQueryProductVariantByKeyValue } from 'shopify/graphql/hooks'
import useStateRef from 'hooks/useStateRef'
import useSizeSelector from 'components/SizeSelector'

import { ApplicationModal } from 'state/modalsAndPopups/reducer'

import {
  FragmentProductVideoFragment,
  FragmentProductImageFragment,
  ProductOptionsSize,
  ProductArtistInfo,
  Product
} from 'shopify/graphql/types'

import { getImageSizeMap } from 'shopify/utils'
import { FREE_SHIPPING_THRESHOLD, SINGLE_ITEM_LOGO_RATIO, Z_INDEXES } from 'constants/config'

import { isMobile } from 'utils'
import { /* getMobileShowcaseVideo916Height, */ setCatalogImagesLqProps } from './utils'
import useModelSizeSelector from 'components/ModelSizeSelector'
import useShowShowcase from 'components/Showcase/Settings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-regular-svg-icons'
import ShowcaseVideos from 'components/Showcase/Videos'
import { Package, Truck } from 'react-feather'
import { GenericImageSrcSet } from 'shopify/graphql/types'
import { useAppSelector } from 'state'
import ShowcaseVideoControls from 'components/Showcase/Videos/Settings'
import AddToCartButton from 'components/AddToCartButton'
import { darken, transparentize } from 'polished'
import { TYPE } from 'theme'
import HorizontalSwipeCarousel from 'components/Carousel/HorizontalSwipeCarousel'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { Price } from 'components/Price'
import { LargeImageCarousel } from './LargeImageCarousel'

export interface ProductPageProps {
  bgColor: string
  color: string
  title: string
  handle: string
  logo?: GenericImageSrcSet
  headerLogo?: GenericImageSrcSet
  navLogo?: GenericImageSrcSet
  images: FragmentProductImageFragment[]
  videos: FragmentProductVideoFragment[]
  // media: (FragmentProductExternalVideoFragment | FragmentProductVideoFragment)[]
  sizes: ProductOptionsSize
  description: string
  artistInfo?: ProductArtistInfo
  shortDescription?: string
  id: string
  collectionView?: boolean
  noVideo?: boolean
  noDescription?: boolean
}

export type CollectionMap = Record<Product['handle'], ProductPageProps>

export type ItemPageDesignsProps = {
  headerLogo?: string
  navLogo?: string
}

const DEFAULT_MEDIA_START_INDEX = 0
export type SingleItemPageProps = ProductPageProps &
  ScrollableContentComponentBaseProps & {
    style?: any
    showBreadCrumbs: boolean
    showProductLabel?: boolean
  }
export default function ItemPage({
  bgColor,
  color = '#000',
  id,
  handle,
  title,
  shortDescription,
  logo,
  navLogo,
  headerLogo,
  images = [],
  videos = [],
  // media,
  sizes = [],
  description,
  artistInfo,
  // TODO: re-enable id
  // id,
  isActive,
  firstPaintOver,
  loadInViewOptions,
  collectionView = false,
  noVideo = false,
  showBreadCrumbs,
  showProductLabel = false,
  style,
  itemIndex
}: SingleItemPageProps) {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(DEFAULT_MEDIA_START_INDEX)
  const onCarouselChange = (index: number) => setCurrentCarouselIndex(index)

  // MODALS
  const toggleLargeImageModal = useToggleModal(ApplicationModal.ITEM_LARGE_IMAGE)
  const closeModals = useCloseModals()
  const showLargeImage = useModalOpen(ApplicationModal.ITEM_LARGE_IMAGE)

  /// BREADCRUMBS
  const breadcrumbs = useBreadcrumb()

  // IMAGES
  const imageUrls = getImageSizeMap(images)

  const updateCurrentlyViewing = useUpdateCurrentlyViewing()
  useEffect(() => {
    if (isActive) {
      updateCurrentlyViewing({ handle, id })
    }
  }, [isActive, handle, id, updateCurrentlyViewing])

  // inner container ref
  const [innerContainerRef, setRef] = useStateRef<HTMLDivElement | null>(null, node => node)
  const [viewRef, setViewRef] = useStateRef<HTMLDivElement | null>(null, node => node)

  const DynamicInnerContainer = useMemo(() => (collectionView ? InnerCollectionContainer : InnerContainer), [
    collectionView
  ])

  const { ShowcaseSettings } = useShowShowcase()
  const { autoplay } = useAppSelector(state => state.user.showcase.videoSettings)
  const { SizeSelector, selectedSize } = useSizeSelector({ sizes })
  const { ModelSizeSelector } = useModelSizeSelector()
  const variant = useQueryProductVariantByKeyValue({ productId: id, key: 'Size', value: selectedSize })

  const isMobileWidth = useIsMobileWindowWidthSize()

  // mobile vs web carousel
  const Carousel = useMemo(() => (isMobile ? HorizontalSwipeCarousel : ButtonCarousel), [])

  return (
    <>
      <LargeImageCarousel
        images={[imageUrls[currentCarouselIndex]]}
        accentColor={color}
        isOpen={isActive && showLargeImage}
        imageProps={{
          loadInViewOptions,
          lqImageOptions: {
            width: innerContainerRef?.clientWidth || 0,
            height: innerContainerRef?.clientWidth || 0,
            showLoadingIndicator: true
          }
        }}
        toggleModal={toggleLargeImageModal}
        dismissModal={closeModals}
      />

      {/* Product label: used in scolling collection */}
      {showProductLabel && (
        <ScrollingProductLabel logo={headerLogo} labelColor={bgColor} flexWrap="wrap">
          <Row>
            <Row justifyContent="space-between" alignItems={'center'} width="100%">
              <strong>{title}</strong>
              <strong>
                VIEWING {itemIndex + 1}/{6}
              </strong>
            </Row>
          </Row>
          <Row>
            <span style={{ fontSize: 'smaller' }}>{shortDescription}</span>
          </Row>
        </ScrollingProductLabel>
      )}
      {/* Item content */}
      <ItemContainer
        id="#item-container"
        style={style}
        collectionView={collectionView}
        bgColor={color}
        navLogo={navLogo}
        logo={logo}
      >
        <ItemAsidePanel id="#item-aside-panel">
          <DynamicInnerContainer ref={setRef}>
            {/* SCREEN 1 - CAROUSEL & LOGO */}
            <ItemContentContainer ref={setViewRef}>
              {/* Breadcrumbs */}
              {showBreadCrumbs && (
                <Breadcrumbs
                  {...breadcrumbs}
                  marginTop="0.5rem"
                  marginLeft="0.5rem"
                  marginBottom={-25}
                  color={bgColor}
                />
              )}
              {/* Item carousel */}
              <Carousel
                accentColor={color}
                showButtons={!collectionView}
                collectionView={collectionView}
                startIndex={currentCarouselIndex}
                onCarouselChange={onCarouselChange}
                // collection view? disable touch actions
                // else default to horizontal default (pan-y/zoom)
                touchAction={collectionView ? 'none' : 'pan-y'}
                fixedSizes={
                  collectionView
                    ? // set collection view to the innerContainer height
                      {
                        fixedHeight: innerContainerRef?.clientHeight || 0,
                        fixedWidth: innerContainerRef?.clientHeight || 0
                      }
                    : isMobile && viewRef?.clientHeight
                    ? // TODO: check and fix
                      {
                        fixedHeight: (viewRef.clientHeight - 80) * 0.74,
                        fixedWidth: (viewRef.clientHeight - 80) * 0.74
                      }
                    : undefined
                }
                // image related props
                onCarouselItemClick={toggleLargeImageModal}
                data={isMobile || isMobileWidth ? imageUrls.concat(null as any) : imageUrls}
              >
                {({ index, imageTransformations }) => {
                  if (!imageUrls[index]?.defaultUrl) {
                    return (
                      <ShowcaseVideos
                        videos={videos}
                        videoProps={{
                          // TODO: check ios autoplay
                          autoPlay: autoplay,
                          style: {
                            cursor: 'pointer'
                          }
                        }}
                        currentCarouselIndex={currentCarouselIndex}
                        hideVideo={!isMobileWidth}
                        firstPaintOver={firstPaintOver}
                        zIndex={Z_INDEXES.PRODUCT_VIDEOS}
                        height={'100%'}
                        margin="0 0 2rem"
                        title="Tap to play/pause"
                        isMobileWidth
                      />
                    )
                  } else {
                    const { defaultUrl, ...urlRest } = imageUrls[index]

                    return (
                      <SmartImg
                        path={{ defaultPath: defaultUrl }}
                        pathSrcSet={urlRest}
                        transformation={imageTransformations}
                        loadInViewOptions={loadInViewOptions}
                        lqImageOptions={{
                          ...imageTransformations?.[0],
                          ...setCatalogImagesLqProps(innerContainerRef, collectionView)
                        }}
                        // ref={imageProps.forwardedRef}
                        onClick={toggleLargeImageModal}
                      />
                    )
                  }
                }}
              </Carousel>
              {/* DYNAMIC LOGO */}
              <Logo
                parentNode={innerContainerRef}
                isCollectionView={collectionView}
                logos={{ header: headerLogo, nav: navLogo, main: logo }}
              />
              {!collectionView && (
                <Row alignItems={'center'} justifyContent="space-evenly" padding="1rem">
                  <Column maxWidth={'60%'}>
                    <TYPE.productText fontSize="3rem" fontWeight={200}>
                      {title}
                    </TYPE.productText>
                    <TYPE.productText>{shortDescription}</TYPE.productText>
                  </Column>
                  {/* VARIANT PRICE */}
                  <Price
                    price={variant?.variantBySelectedOptions?.priceV2}
                    fontWeight={300}
                    fontSize={'2rem'}
                    margin={'auto 0 0 auto'}
                    padding={'0.5rem'}
                    flex="0 1 auto"
                    maxWidth="40%"
                    bgColor={darken(0.13, transparentize(0.2, color))}
                  />
                </Row>
              )}
            </ItemContentContainer>

            {/* SCREEN 2 - ITEM CONTENT: description, credits, etc */}
            {!collectionView && (
              <>
                <ItemContentContainer padding="0 0 3rem">
                  {/* Size selector */}
                  <ItemSubHeader
                    useGradient
                    bgColor={color}
                    label="SIZE & SHOWCASE"
                    margin={isMobileWidth ? '1rem 0' : '0 0 2rem 0'}
                  />
                  <Column margin="0" padding={'0 2rem'}>
                    {/* SHOWCASE MODEL SHOWCASE SETTINGS */}
                    <ItemDescription fontWeight={300} padding="1rem 1.8rem" margin="0" style={{ zIndex: 1 }}>
                      <Row gap="1rem">
                        <FontAwesomeIcon icon={faLightbulb} /> SHOWCASE SETTINGS{' '}
                      </Row>
                    </ItemDescription>
                    <ShowcaseSettings>
                      <ShowcaseVideoControls isMobile={isMobileWidth || isMobile} />
                      {/* MOBILE SHOWCASE */}
                      <ModelSizeSelector />
                      {/* PRODUCT SIZE SELECTOR */}
                      <SizeSelector color={color} margin="0" />
                    </ShowcaseSettings>
                    {/* ADD TO CART */}
                    <AddToCartButton
                      merchandiseId={variant?.variantBySelectedOptions?.id}
                      quantity={1}
                      buttonProps={{ bgImage: navLogo, backgroundColor: color || '#000' }}
                    />
                    {/* FREE SHIPPING LABEL */}
                    {FREE_SHIPPING_THRESHOLD && (
                      <FreeShippingBanner fontWeight={300} flex="auto" minWidth={'21rem'} marginTop="2rem">
                        <Truck />
                        <Package /> FREE SHIPPING OVER {FREE_SHIPPING_THRESHOLD}€
                      </FreeShippingBanner>
                    )}
                  </Column>
                </ItemContentContainer>

                <ItemContentContainer>
                  {/* Item description */}
                  <ItemSubHeader useGradient bgColor={color} label="INFO & CARE INSTRUCTIONS" />
                  <Column padding="0 1.5rem">
                    {/* From shopify backened console */}
                    <ItemBackendDescription
                      dangerouslySetInnerHTML={{ __html: description }}
                      padding="0rem 4rem 1rem"
                      fontWeight={300}
                      accentColor={color}
                    />
                  </Column>
                  {/* Credits */}
                  <ItemSubHeader useGradient bgColor={color} label="CREDIT WHERE CREDIT IS DUE" margin="2rem 0" />
                  <Column padding={'0 3rem'}>
                    <ItemCredits>
                      {artistInfo ? (
                        <ItemArtistInfo {...artistInfo} bgColor={color} />
                      ) : (
                        <HighlightedText bgColor={color}>{PASTELLE_CREDIT}</HighlightedText>
                      )}
                    </ItemCredits>
                  </Column>
                </ItemContentContainer>
              </>
            )}
          </DynamicInnerContainer>
        </ItemAsidePanel>
        {!collectionView && (
          <ShowcaseVideos
            videos={videos}
            videoProps={{
              autoPlay: true,
              style: {
                marginLeft: 'auto'
              }
            }}
            // // starts autoplaying and stops on "stopTime" seconds
            // autoPlayOptions={{
            //   stopTime: 4
            // }}
            hideVideo={isMobileWidth || noVideo || collectionView}
            showPoster={false}
            height="calc(100vh - 10rem)"
            zIndex={Z_INDEXES.BEHIND}
            firstPaintOver={firstPaintOver}
            currentCarouselIndex={currentCarouselIndex}
            isMobileWidth={false}
          />
        )}
      </ItemContainer>
    </>
  )
}

type LogoParams = {
  parentNode: HTMLElement | null
  logos: { header?: GenericImageSrcSet; nav?: GenericImageSrcSet; main?: GenericImageSrcSet }
  isCollectionView: boolean
}
function Logo({ isCollectionView, logos, parentNode }: LogoParams) {
  const showCollectionLogo = isCollectionView && (logos.nav || logos.header)
  const collectionLogo = logos.nav || logos.header

  if (showCollectionLogo && collectionLogo) {
    return <ItemLogoCollectionView logoUri={collectionLogo} $bgColor="ghostwhite" />
  } else if (parentNode?.clientWidth && logos.main) {
    return !isMobile ? (
      <ItemLogo>
        <SmartImg
          path={{ defaultPath: logos.main.defaultUrl }}
          pathSrcSet={logos.main}
          lazy={false}
          lqImageOptions={{
            width: parentNode?.clientWidth || 0,
            get height() {
              return (this.width * SINGLE_ITEM_LOGO_RATIO[0]) / SINGLE_ITEM_LOGO_RATIO[1]
            },
            showLoadingIndicator: false
          }}
        />
      </ItemLogo>
    ) : (
      <ItemLogoCssImport logoUri={logos.main} height={parentNode.clientWidth / 3.64} position="relative" />
    )
  } else {
    return null
  }
}
