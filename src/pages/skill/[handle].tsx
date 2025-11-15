/* eslint-disable react-refresh/only-export-components */
import { useIsMobile } from '@past3lle/hooks'
import SEO from '@/components/SEO'
import ShowcaseVideos from '@/components/Showcase/Videos'
import { Z_INDEXES } from '@/constants/config'
import { SHOWCASE_ENABLED } from '@/constants/flags'
import { DEFAULT_MEDIA_START_INDEX } from '@/components/PagesComponents/constants'
import { useProductWebCarouselActions } from '@/components/PagesComponents/hooks/useProductCarouselActions'
import { useUpdateCurrentlyViewingProduct } from '@/state/collection/hooks'

import AsideWithVideo from '../../components/Asides/skill/AsideWithVideo'
import { LargeProductAndSizeChartImagesCarousel } from '../../components/Asides/skill/LargeProductAndSizeChartCarousels'
import {
  SingleProductAsidePanel,
  SingleProductContainer,
  SingleProductScreensContainer,
} from '../../components/Asides/skill/styled'
import { queryProductPaths } from '@/shopify/graphql/api/products'
import { BaseProductPageProps } from '@/components/PagesComponents/types'
import { BLACK } from '@past3lle/theme'
import { SkillLockStatus } from '@past3lle/forge-web3'
import { ProductSchema } from '@/components/SEO/types'
import { getProductSeoSchema } from '@/components/SEO/utils'
import { DEFAULT_PRODUCT_DESCRIPTION } from '@/components/SEO/constants'
import { useProductViewReporter } from '@/analytics/hooks/useProductViewReporter'
import dynamic from 'next/dynamic'
import { useIsClientReady } from '@/hooks/useIsClientReady'
import { AnimatedPastelleLoader } from '@/components/Loader'
import { fetchLatestCollectionAndUpdateStore } from '@/api'
import { wrapper } from '@/state'
import { collectionProductFromParamsSelector } from '@/api/collection/utils'

const SinglePageSmartWrapper = dynamic(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "HOMESMARTWRAPPER" */ '@/components/PagesComponents'),
  { ssr: false }
)

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const {
    products: { nodes },
  } = await queryProductPaths('tag:COLLECTION-1')

  // Get the paths we want to pre-render based on products
  const paths = nodes.map((node) => ({
    params: { handle: node.handle, id: node.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export const getStaticProps = wrapper.getStaticProps((store) => async ({ params }) => {
  // 1. Fetch store collection data from gql
  // 2. Save collection data to the redux store
  const [latestCollection] = await fetchLatestCollectionAndUpdateStore(store)
  const product = collectionProductFromParamsSelector(params, latestCollection)

  if (!product)
    throw new Error(
      'Missing product information with handle/id ' + JSON.stringify(params?.handle || params?.id || 'UNKNOWN PRODUCT!')
    )

  // Pass post data to the page via props
  return { props: { data: product, schema: getProductSeoSchema(product) } }
})

interface Props {
  data: BaseProductPageProps | undefined
  schema: ProductSchema | null
}

export default function SingleProductPage({ data: product, schema, ...rest }: Props) {
  // TODO: fix this. issue with hydration always being true
  // https://github.com/kirill-konshin/next-redux-wrapper/issues/571
  // We need this to sync client/server side data and the redux store
  wrapper.useHydration(rest)

  // Update GA
  useProductViewReporter(product)

  // update state store with current browsing SINGLE product
  useUpdateCurrentlyViewingProduct(true, product)

  // MOBILE/WEB CAROUSEL
  const { currentIndex: currentCarouselIndex, onChange: onCarouselChange } = useProductWebCarouselActions({
    startIndex: DEFAULT_MEDIA_START_INDEX,
  })

  const isMobile = useIsMobile()
  const clientReady = useIsClientReady()

  const showLoader = !product || !schema
  if (showLoader) return <AnimatedPastelleLoader />

  return (
    <>
      <SEO
        name={product.handle.toUpperCase()}
        title={product.seo.title || `${product.handle.toUpperCase()} | PASTELLE APPAREL`}
        description={
          product.seo.description || product.description || product.shortDescription || DEFAULT_PRODUCT_DESCRIPTION
        }
        image={product.images?.[0].url1280_2x}
        cannonicalUrl={`skill/${product.handle}`}
        schema={schema}
      />
      <SinglePageSmartWrapper>
        {(smartWrapperProps) =>
          !clientReady ? null : (
            <>
              <LargeProductAndSizeChartImagesCarousel
                color={product.color}
                images={product.images}
                lockedImages={product.lockedImages}
                sizeChart={product.sizeChart}
                currentIndex={currentCarouselIndex}
                isMobile={isMobile}
                skillState={product.lockStatus}
              />
              <SingleProductContainer id="#item-container" parentAspectRatio={smartWrapperProps.parentAspectRatio}>
                <SingleProductAsidePanel id="#item-aside-panel" ref={smartWrapperProps.asideContainerRef}>
                  <SingleProductScreensContainer
                    $calculatedSizes={{
                      height: smartWrapperProps.asideContainerRef.current?.clientHeight,
                      width: smartWrapperProps.screensContainerNode?.clientWidth,
                    }}
                    ref={smartWrapperProps.setScreensContainerRef}
                    bgColor={product?.bgColor || BLACK}
                    navLogo={product?.navLogo}
                    logo={product?.logo}
                  >
                    <AsideWithVideo
                      {...smartWrapperProps}
                      {...product}
                      lockStatus={product.lockStatus}
                      isMobile={isMobile}
                      carousel={{ index: currentCarouselIndex, onChange: onCarouselChange }}
                    />
                  </SingleProductScreensContainer>
                </SingleProductAsidePanel>
                <ShowcaseVideos
                  videos={product.videos}
                  forceLoad={isMobile}
                  smartFill={SHOWCASE_ENABLED && !isMobile ? { side: true } : undefined}
                  hideVideo={isMobile || !!product?.noVideo}
                  showPoster
                  height={'100%'}
                  zIndex={Z_INDEXES.BEHIND}
                  firstPaintOver
                  currentCarouselIndex={currentCarouselIndex}
                  isMobileWidth={false}
                />
              </SingleProductContainer>
            </>
          )
        }
      </SinglePageSmartWrapper>
    </>
  )
}

/* 
const [searchParams] = useSearchParams()
  // TODO: use this properly
  useQueryProductById({
    id: getShopifyId(searchParams.get('skillId'), 'Product'),
    imageAmt: DEFAULT_CURRENT_COLLECTION_VARIABLES.imageAmt,
    videoAmt: DEFAULT_CURRENT_COLLECTION_VARIABLES.videoAmt,
  })
*/
