'use client'
import { MINIMUM_COLLECTION_ITEM_HEIGHT } from '@/constants/config'
import { CollectionScreensContainer } from './styled'
import { useIsMobile, useStateRef } from '@past3lle/hooks'
import { DEFAULT_MEDIA_START_INDEX } from '@/components/PagesComponents/constants'
import { useGetCommonPropsFromProduct } from '@/components/PagesComponents/hooks/useGetCommonPropsFromProduct'
import { FORGE_WEB3_ENABLED } from '@/constants/flags'
import { getImageSizeMap } from '@/shopify/utils'
import { useAppSelector } from '@/state'
import { useGetSelectedProductShowcaseVideo } from '@/state/collection/hooks'
import { useThemeManager } from '@/state/user/hooks'
import { useW3UserConnectionInfo, SkillLockStatus } from '@past3lle/forge-web3'
import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { CollectionPageProps } from '@/components/PagesComponents/types'

const AsideCarousel = dynamic(
  () =>
    import(
      /* webpackPrefetch: true,  webpackChunkName: "ASIDECAROUSEL" */ '@/components/PagesComponents/screens/AsideCarousel'
    ),
  { ssr: false }
)

export default function CollectionScreenWithCarousel(props: CollectionPageProps) {
  const { lockStatus, lockedImages, images, carousel, dimensions, videos } = props

  // CONTENT CONTAINER REF FOR DYNAMIC SIZE UPDATING AND CAROUSELS
  const [innerContainerRef, setRef] = useStateRef<HTMLDivElement | null>(null, (node) => node)

  // CAROUSEL STATE
  const [currentCarouselIndex] = useState(DEFAULT_MEDIA_START_INDEX)
  // SELECTED SHOWCASE VIDEO
  const selectedVideo = useGetSelectedProductShowcaseVideo({ videos })

  // USER VIDEO AUTOPLAY SETTINGS
  const { autoplay: autoPlay } = useAppSelector((state) => state.user.showcase.videoSettings)

  const isMobile = useIsMobile()
  const commonProps = useGetCommonPropsFromProduct({ ...props, isMobile, variant: undefined, lockStatus })

  const { mode } = useThemeManager()

  // USER BLOCKCHAIN INFO
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { address } = (FORGE_WEB3_ENABLED && useW3UserConnectionInfo()) || { address: undefined }

  // Src-set of all images
  const imageSrcSet = useMemo(
    () =>
      getImageSizeMap(
        lockStatus === SkillLockStatus.LOCKED
          ? lockedImages
          : !isMobile && images.length === 1
          ? [images[0], images[0]]
          : images
      ),
    [lockStatus, lockedImages, isMobile, images]
  )

  return (
    <CollectionScreensContainer ref={setRef}>
      <AsideCarousel
        {...commonProps}
        carousel={{
          ...carousel,
          data: isMobile ? [...imageSrcSet, ...('__typename' in selectedVideo ? [selectedVideo] : [])] : imageSrcSet,
          touchAction: 'none',
          startIndex: currentCarouselIndex,
          videoProps: {
            autoPlay,
          },
          dimensions: {
            fixedSizes: {
              height:
                dimensions?.fixedSizes?.fixedHeight ||
                innerContainerRef?.clientHeight ||
                MINIMUM_COLLECTION_ITEM_HEIGHT,
              width:
                dimensions?.fixedSizes?.fixedWidth || innerContainerRef?.clientHeight || MINIMUM_COLLECTION_ITEM_HEIGHT,
            },
          },
        }}
        themeMode={mode}
        breadcrumbs={null}
        containerNode={innerContainerRef}
        userAddress={address}
        hidePrice
        isCollectionView
      />
    </CollectionScreensContainer>
  )
}
