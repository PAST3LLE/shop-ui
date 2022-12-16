import { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-regular-svg-icons'
import { Package, Truck } from 'react-feather'

import { useAppSelector } from 'state'
import useStateRef from 'hooks/useStateRef'
import { useCloseModals, useModalOpen, useToggleModal } from 'state/modalsAndPopups/hooks'
import { useGetSelectedProductShowcaseVideo } from 'state/collection/hooks'
import { useIsMobileWindowWidthSize } from 'state/window/hooks'
import { ApplicationModal } from 'state/modalsAndPopups/reducer'

import { Column, Row } from 'components/Layout'
import {
  ItemContainer as ProductContainer,
  ItemAsidePanel as ProductAsidePanel,
  ItemDescription,
  ItemCredits,
  ItemArtistInfo,
  PASTELLE_CREDIT,
  ItemSubHeader,
  InnerContainer as ProductScreensContainer,
  HighlightedText,
  ItemContentContainer as ProductScreen,
  FreeShippingBanner,
  ItemBackendDescription
} from 'pages/common/styleds'

import { useBreadcrumb } from 'components/Breadcrumb'
import useSizeSelector from 'components/SizeSelector'
import useModelSizeSelector from 'components/ModelSizeSelector'
import useShowShowcase from 'components/Showcase/Settings'
import ShowcaseVideos from 'components/Showcase/Videos'
import ShowcaseVideoControls from 'components/Showcase/Videos/Settings'
import AddToCartButton from 'components/AddToCartButton'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { LargeImageCarousel } from 'components/Carousel/LargeProductImageCarousel'
import * as Carousels from 'components/Carousel/ProductCarousels'

import { SingleProductPageProps } from 'pages/common/types'
import { DEFAULT_MEDIA_START_INDEX } from 'pages/common/constants'
import ProductPriceAndLabel from 'pages/common/components/ProductPriceAndLabel'
import Logo from 'pages/common/components/Logo'

import { isMobile } from 'utils'
import { getImageSizeMap } from 'shopify/utils'
import { FREE_SHIPPING_THRESHOLD, Z_INDEXES } from 'constants/config'
import { useQueryProductVariantByKeyValue } from 'shopify/graphql/hooks'

export default function SingleProductPage({
  id,
  title,
  logo,
  color = '#000',
  bgColor,
  navLogo,
  headerLogo,
  // media,
  artistInfo,
  sizes = [],
  images = [],
  videos = [],
  description,
  noVideo = false,
  shortDescription
}: SingleProductPageProps) {
  // MODALS
  const toggleLargeImageModal = useToggleModal(ApplicationModal.ITEM_LARGE_IMAGE)
  const closeModals = useCloseModals()
  const showLargeImage = useModalOpen(ApplicationModal.ITEM_LARGE_IMAGE)

  const [viewRef, setViewRef] = useStateRef<HTMLDivElement | null>(null, node => node)
  const { autoplay: autoPlay } = useAppSelector(state => state.user.showcase.videoSettings)

  // MOBILE/WEB CAROUSEL
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(DEFAULT_MEDIA_START_INDEX)
  const onCarouselChange = (index: number) => setCurrentCarouselIndex(index)
  const Carousel = useCallback(
    (props: any) =>
      isMobile ? (
        <Carousels.SwipeCarousel {...props} />
      ) : (
        <Carousels.ClickCarousel
          {...props}
          showButtons
          onCarouselItemClick={toggleLargeImageModal}
          onCarouselChange={onCarouselChange}
        />
      ),
    [toggleLargeImageModal]
  )

  /// BREADCRUMBS
  const breadcrumbs = useBreadcrumb()

  // IMAGES
  const imageUrls = getImageSizeMap(images)
  // SELECTED SHOWCASE VIDEO
  const selectedVideo = useGetSelectedProductShowcaseVideo({ videos })

  // CONTENT CONTAINER REF FOR DYNAMIC SIZE UPDATING AND CAROUSELS
  const [innerContainerRef, setRef] = useStateRef<HTMLDivElement | null>(null, node => node)

  const { ShowcaseSettings } = useShowShowcase()
  const { SizeSelector, selectedSize } = useSizeSelector({ sizes })
  const { ModelSizeSelector } = useModelSizeSelector()
  const variant = useQueryProductVariantByKeyValue({ productId: id, key: 'Size', value: selectedSize })

  const isMobileWidth = useIsMobileWindowWidthSize()

  return (
    <>
      <LargeImageCarousel
        images={[imageUrls[currentCarouselIndex]]}
        accentColor={color}
        isOpen={showLargeImage}
        imageProps={{
          lqImageOptions: {
            width: innerContainerRef?.clientWidth || 0,
            height: innerContainerRef?.clientWidth || 0,
            showLoadingIndicator: true
          }
        }}
        toggleModal={toggleLargeImageModal}
        dismissModal={closeModals}
      />
      {/* Item content */}
      <ProductContainer id="#item-container" collectionView={false} bgColor={color} navLogo={navLogo} logo={logo}>
        <ProductAsidePanel id="#item-aside-panel">
          {/* WRAPS ALL THE CONTENT SCREENS (CAROUSEL || SHOWCASE || INFO) */}
          <ProductScreensContainer ref={setRef}>
            {/* SCREEN 1 - CAROUSEL & LOGO */}
            <ProductScreen ref={setViewRef}>
              {/* Breadcrumbs */}
              <Breadcrumbs {...breadcrumbs} marginTop="0.5rem" marginLeft="0.5rem" marginBottom={-25} color={bgColor} />
              {/* Product carousel */}
              <Carousel
                data={isMobile ? [...imageUrls, selectedVideo] : imageUrls}
                startIndex={currentCarouselIndex}
                accentColor={color}
                videoProps={{ autoPlay }}
                fixedSizes={
                  isMobile && viewRef?.clientHeight
                    ? // TODO: check and fix
                      {
                        fixedHeight: (viewRef.clientHeight - 80) * 0.74,
                        fixedWidth: (viewRef.clientHeight - 80) * 0.74
                      }
                    : undefined
                }
              />
              {/* DYNAMIC LOGO */}
              <Logo
                parentNode={innerContainerRef}
                isCollectionView={false}
                logos={{ header: headerLogo, nav: navLogo, main: logo }}
              />
              <ProductPriceAndLabel variant={variant} color={color} title={title} shortDescription={shortDescription} />
            </ProductScreen>

            {/* SCREEN 2 - SHOWCASE */}
            <ProductScreen padding="0 0 3rem">
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
            </ProductScreen>

            {/* SCREEN 3 - ITEM INFO */}
            <ProductScreen>
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
            </ProductScreen>
          </ProductScreensContainer>
        </ProductAsidePanel>

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
          hideVideo={isMobileWidth || noVideo}
          showPoster={false}
          height="calc(100vh - 10rem)"
          zIndex={Z_INDEXES.BEHIND}
          firstPaintOver
          currentCarouselIndex={currentCarouselIndex}
          isMobileWidth={false}
        />
      </ProductContainer>
    </>
  )
}