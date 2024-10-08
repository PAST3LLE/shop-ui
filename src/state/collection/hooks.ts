import { useIsMobile } from '@past3lle/hooks'
import { ShowcaseVideosProps } from '@/components/Showcase/Videos'
import { SHOWCASE_ENABLED } from '@/constants/flags'
import { ShowcaseVideo } from '@/components/Asides/skill/ItemVideoContent'
import { BaseProductPageProps } from '@/components/PagesComponents/types'
import { useCallback, useEffect, useMemo } from 'react'
// import { useQueryHomepage } from '@/shopify/graphql/hooks'
import { FragmentProductVideoFragment, Product } from '@/shopify/graphql/types'
import { reduceShopifyMediaToShowcaseVideos } from '@/shopify/utils'
import { useAppDispatch, useAppSelector } from '@/state'
import { useGetShowcaseSettings } from '@/state/user/hooks'

import {
  CollectionProductMap,
  ProductCurrentlyViewing,
  ProductPageMap,
  updateCollections,
  updateCurrentCollection,
  updateCurrentlyViewing,
  updateLoadingState,
  updateSingleProductInCollection,
} from './reducer'
import { useSearchParams } from 'next/navigation'

export function useUpdateCurrentlyViewing() {
  const dispatch = useAppDispatch()

  return useCallback((params: ProductCurrentlyViewing) => dispatch(updateCurrentlyViewing(params)), [dispatch])
}

export const useOnScreenProductHandle = () => useAppSelector(({ collection }) => collection.currentlyViewing)
export function useUpdateCurrentlyViewingProduct(
  isActive: boolean | undefined,
  product?: Pick<Product, 'handle' | 'id'> | null,
) {
  const updateCurrentlyViewing = useUpdateCurrentlyViewing()
  useEffect(() => {
    if (isActive && product) {
      updateCurrentlyViewing(product)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, product?.handle, product?.id, updateCurrentlyViewing])
}

export function useUpdateCurrentlyViewingCollection(
  isActive: boolean | undefined,
  collection?: Pick<CollectionProductMap, 'title' | 'id'> | null,
) {
  const updateCurrentCollection = useUpdateCurrentCollection()
  useEffect(() => {
    if (isActive && collection) {
      updateCurrentCollection(collection.id, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, collection?.id, updateCurrentCollection])
}

export function useCollection() {
  return useAppSelector((state) => state.collection)
}

export function useIsCollectionLoading() {
  return useAppSelector((state) => state.collection.loading)
}

export function useCurrentCollection() {
  const { collections, current } = useCollection()

  const currentCollection = current?.id ? collections?.[current.id] : null

  return currentCollection
    ? { collection: currentCollection, title: currentCollection.title }
    : { collection: undefined, title: undefined }
}

export function useDeriveCurrentCollection() {
  const collectionFromUrl = useGetCurrentCollectionFromUrl()
  const { collection: currentCollection } = useCurrentCollection()
  const { collections, latest } = useCollection()
  return currentCollection || collectionFromUrl || (latest && collections[latest]) || null
}

export function useDeriveCurrentCollectionId() {
  return useDeriveCurrentCollection()?.id
}

export function useUpdateCurrentCollection() {
  const dispatch = useAppDispatch()
  return useCallback(
    (id: string | undefined, loading: boolean) => dispatch(updateCurrentCollection({ id, loading })),
    [dispatch],
  )
}

export function useUpdateCollections() {
  const dispatch = useAppDispatch()
  return useCallback(
    (collections: CollectionProductMap[], loading: boolean) => dispatch(updateCollections({ collections, loading })),
    [dispatch],
  )
}

export function useUpdateSingleProductInCollection() {
  const dispatch = useAppDispatch()
  return useCallback(
    (product: ProductPageMap[string], id: string) => dispatch(updateSingleProductInCollection({ product, id })),
    [dispatch],
  )
}

export function useUpdateCollectionLoadingStatus() {
  const dispatch = useAppDispatch()
  return useCallback((loading: boolean) => dispatch(updateLoadingState(loading)), [dispatch])
}

export function useGetCurrentCollectionFromUrl() {
  // we need to use the URL to determine what item we're currently viewing
  const searchParams = useSearchParams()
  const id = searchParams?.get('collection')
  const sanitizedId = id?.toLowerCase()
  return useAppSelector((state) => {
    switch (sanitizedId) {
      case 'latest': {
        const id = state.collection.latest
        return id ? state.collection.collections[id] : state.collection.collections[0]
      }
      case undefined:
        return undefined
      default:
        return state.collection.collections[sanitizedId]
    }
  })
}

export function useGetCurrentCollectionProductsFromUrl() {
  // we need to use the URL to determine what item we're currently viewing
  const searchParams = useSearchParams()
  const handle = searchParams?.get('handle')

  const { collection } = useCurrentCollection()

  const currentCollectionProduct = collection && handle ? collection.products[handle] : undefined
  if (!currentCollectionProduct || !collection?.products) return null

  return {
    collectionProductList: collection.products,
    currentCollectionProduct,
    handle,
  }
}

export function useCurrentOrFirstCollection() {
  const { collection: currentCollection } = useCurrentCollection()
  const collections = useCollection()

  return currentCollection || Object.values(collections?.collections)?.[0]
}

export function useGetCurrentOnScreenCollectionProduct(pathname?: string): BaseProductPageProps | null {
  const { collections, current, homepage } = useCollection()

  const item = useOnScreenProductHandle()

  const isHomePage = pathname === '/'
  return item ? (isHomePage ? homepage : collections?.[current?.id || '']?.products?.[item.handle]) : null
}

export function useCurrentProductMedia(pathname?: string) {
  const onScreenCollectionItem = useGetCurrentOnScreenCollectionProduct(pathname)

  const currentItem = /* isHomepage ? homepageItem : */ onScreenCollectionItem

  return useMemo(
    () => ({
      bgColor: currentItem?.bgColor,
      color: currentItem?.color,
      headerLogoSet: currentItem?.headerLogo,
      logoSet: currentItem?.logo,
      navLogoSet: currentItem?.navLogo,
    }),
    [currentItem],
  )
}

export function useGetAllProductThemeMedia() {
  const { collection } = useCurrentCollection()
  if (!collection) return null

  return Object.values(collection.products).map(({ headerLogo, navLogo, logo, color, bgColor, altColor }) => ({
    headerLogo,
    navLogo,
    logo,
    color,
    bgColor,
    altColor,
  }))
}

export function useGetProductShowcaseVideos({ videos }: Pick<ShowcaseVideosProps, 'videos'>) {
  const { gender, height, size } = useGetShowcaseSettings()

  return useMemo(() => _constructShowcaseData({ gender, height, size, videos }), [gender, height, size, videos])
}

export function useGetSelectedProductShowcaseVideo(props: Pick<ShowcaseVideosProps, 'videos'>): ShowcaseVideo {
  const { videoMap, mobileKey, webKey, fallback } = useGetProductShowcaseVideos(props)
  const isMobileDeviceOrWidth = useIsMobile()

  return useMemo(
    () =>
      videoMap[isMobileDeviceOrWidth ? mobileKey : webKey] ||
      videoMap[webKey] ||
      _extendVideo(videoMap[fallback], { isFallback: true }),
    [mobileKey, videoMap, webKey, fallback, isMobileDeviceOrWidth],
  )
}
type ConstructShowcaseDataProps = Pick<ShowcaseVideosProps, 'videos'> &
  Pick<ReturnType<typeof useGetShowcaseSettings>, 'gender' | 'height' | 'size'>

const PROMO_VIDEO_KEY = 'PROMO-VIDEO'
function _constructShowcaseData({ videos, gender, height, size }: ConstructShowcaseDataProps) {
  const videoMap = videos.reduce(reduceShopifyMediaToShowcaseVideos, {})

  if (SHOWCASE_ENABLED) {
    return {
      videoMap,
      webKey: `${gender}-${height}-${size}`,
      get mobileKey() {
        return this.webKey + '-MOBILE'
      },
      fallback: PROMO_VIDEO_KEY,
    }
  } else {
    // Is flagged as false => show default
    return {
      videoMap,
      webKey: PROMO_VIDEO_KEY,
      mobileKey: PROMO_VIDEO_KEY,
      fallback: PROMO_VIDEO_KEY,
    }
  }
}

function _extendVideo<T extends FragmentProductVideoFragment, E extends Record<string, unknown>>(
  video: T,
  extension: E,
): T & E {
  return Object.assign({}, video, extension)
}

export function useGetProductFromHandle(handle: string | undefined) {
  const { current, collections } = useCollection()
  return useMemo(() => {
    let product: BaseProductPageProps | undefined
    if (handle) {
      const productInCurrentCollection = current?.id && collections?.[current.id]?.products?.[handle]
      if (productInCurrentCollection) {
        product = productInCurrentCollection
      } else {
        const flattenedCollections = Object.values(collections).flatMap((collection) => [
          ...Object.values(collection.products),
        ])
        return flattenedCollections.find((product) => handle === product.handle)
      }
    }

    return product
  }, [current?.id, collections, handle])
}

type ProductTypeMap = { [key: Product['productType']]: Pick<BaseProductPageProps, 'id' | 'title' | 'handle'>[] }
export function useGroupCollectionByType(collection?: ProductPageMap): ProductTypeMap {
  return useMemo(
    () =>
      !collection
        ? {}
        : Object.values(collection).reduce((prev, product) => {
            if (product.productType) {
              const productTypeList = prev[product.productType]
              prev[product.productType] = [
                ...(productTypeList || []),
                { title: product.title, handle: product.handle, id: product.id },
              ]
            }
            return prev
          }, {} as ProductTypeMap),
    [collection],
  )
}

export function useGetHomepageRedux(): BaseProductPageProps | null {
  const collectionState = useCollection()

  return collectionState.homepage
}

export function useGetHomepageMetaAssets(): Pick<
  BaseProductPageProps,
  'headerLogo' | 'color' | 'bgColor' | 'altColor' | 'navLogo'
> | null {
  const homepage = useGetHomepageRedux()

  return {
    bgColor: homepage?.bgColor ?? null,
    color: homepage?.color ?? null,
    altColor: homepage?.altColor ?? null,
    navLogo: homepage?.navLogo,
    headerLogo: homepage?.headerLogo,
  }
}
