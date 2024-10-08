import { getLockStatus, SkillMetadata } from '@past3lle/forge-web3'
import { BaseProductPageProps } from '@/components/PagesComponents/types'
import {
  FragmentCartLineFragment,
  FragmentProductImageFragment,
  FragmentProductVideoFragment,
  Product,
  ProductArtistInfo,
  ProductSizes,
  ProductsList,
  ProductVariantQuery,
} from '@/shopify/graphql/types'
import { ShopImageSrcSet } from '@/types'
import { Category } from '@/analytics/events/types'

export function isJson(str: unknown): str is string {
  if (!str || typeof str !== 'string') {
    return false
  }

  try {
    JSON.parse(str)
  } catch (_e: unknown) {
    return false
  }
  return true
}

export function getMetafields<T>(query: { value?: unknown } | unknown) {
  const test = query && typeof query === 'object' && 'value' in query ? query.value : query
  if (isJson(test)) {
    return JSON.parse(test) as T
  } else {
    return test as T
  }
}

export function isProductVideo(data: unknown): data is FragmentProductVideoFragment {
  return !!data && typeof data === 'object' && '__typename' in data && data.__typename === 'Video'
}

interface MetaAssetMap {
  logo: ShopImageSrcSet
  navbar: ShopImageSrcSet
  header: ShopImageSrcSet
}

export const mapSingleShopifyProductToProps = ({
  product,
  images,
  metaAssetMap,
  lockedImages,
  sizeChart,
}: {
  product: Product
  images: FragmentProductImageFragment[]
  lockedImages: FragmentProductImageFragment[]
  sizeChart: FragmentProductImageFragment[]
  metaAssetMap: MetaAssetMap
}) => ({
  id: product.id,
  title: product.title,
  handle: product.handle,
  productType: product.productType,
  // TODO: fix
  logo: metaAssetMap?.logo ?? null,
  headerLogo: metaAssetMap?.header ?? null,
  navLogo: metaAssetMap?.navbar ?? null,
  description: product.descriptionHtml ?? null,
  // metafields
  altColor: getMetafields<string>(product.altColor) ?? null,
  bgColor: getMetafields<string>(product.bgColor) ?? null,
  color: getMetafields<string>(product.color) ?? null,
  artistInfo: getMetafields<ProductArtistInfo>(product.artistInfo) ?? null,
  skillMetadata: getMetafields<SkillMetadata>(product.skillMetadata) ?? null,
  get lockStatus() {
    return getLockStatus(this.skillMetadata) ?? null
  },
  // TODO: fix
  images,
  lockedImages,
  sizeChart,
  videos: product.media.nodes.filter(isProductVideo) as FragmentProductVideoFragment[],
  sizes: getMetafields<ProductSizes[]>(product.sizes[0].values),
  shortDescription: getMetafields<string>(product.shortDescription),
  seo: product.seo,
  priceRange: product.priceRange,
})
enum MediaAltText {
  PRODUCT_FRONT = 'product-front',
  PRODUCT_BACK = 'product-back',
  PRODUCT_FRONT_LOCKED = 'product-front-locked',
  PRODUCT_BACK_LOCKED = 'product-back-locked',
  PRODUCT_SIZE_CHART = 'size-chart',
  PRODUCT_LOGO = 'logo',
  PRODUCT_NAVBAR = 'navbar',
  PRODUCT_HEADER = 'header',
}
export const mapShopifyProductToProps = (data: ProductsList = []): BaseProductPageProps[] => {
  return data.map((datum) => {
    const productImages: FragmentProductImageFragment[] = []
    const lockedProductImages: FragmentProductImageFragment[] = []
    const sizeChart: FragmentProductImageFragment[] = []
    const metaAssets: FragmentProductImageFragment[] = []

    // Sort each image into it's own list by altText
    datum.images.nodes.forEach((image) => {
      const altText = image.altText?.toLowerCase()
      switch (altText) {
        case MediaAltText.PRODUCT_FRONT:
        case MediaAltText.PRODUCT_BACK:
          productImages.push(image)
          break
        case MediaAltText.PRODUCT_FRONT_LOCKED:
        case MediaAltText.PRODUCT_BACK_LOCKED:
          lockedProductImages.push(image)
          break
        case MediaAltText.PRODUCT_SIZE_CHART:
          sizeChart.push(image)
          break
        case MediaAltText.PRODUCT_HEADER:
        case MediaAltText.PRODUCT_LOGO:
        case MediaAltText.PRODUCT_NAVBAR:
          metaAssets.push(image)
          break
        default:
          break
      }
    })

    // Map meta assets (header/logo/product logos) into a responsive size map
    const metaAssetMap: MetaAssetMap = getImageSizeMap(metaAssets).reduce(
      (acc, asset, i) => {
        const mappedAsset = metaAssets[i]
        if (mappedAsset?.altText) {
          acc[mappedAsset.altText.toLowerCase() as 'logo' | 'header' | 'navbar'] = asset
        }

        return acc
      },
      {} as { logo: ShopImageSrcSet; navbar: ShopImageSrcSet; header: ShopImageSrcSet },
    )

    return mapSingleShopifyProductToProps({
      product: datum,
      images: productImages,
      lockedImages: lockedProductImages,
      sizeChart,
      metaAssetMap,
    })
  })
}

export const mapShopifyHomepageToProps = (data: Product) => {
  const productImages: FragmentProductImageFragment[] = []
  const metaAssets: FragmentProductImageFragment[] = []

  // Sort each image into it's own list by altText
  data.images.nodes.forEach((image) => {
    const altText = image.altText?.toLowerCase()
    switch (altText) {
      case MediaAltText.PRODUCT_FRONT_LOCKED:
      case MediaAltText.PRODUCT_HEADER:
      case MediaAltText.PRODUCT_LOGO:
      case MediaAltText.PRODUCT_NAVBAR:
        metaAssets.push(image)
        break
      default:
        productImages.push(image)
        break
    }
  })

  // Map meta assets (header/logo/product logos) into a responsive size map
  const metaAssetMap: MetaAssetMap = getImageSizeMap(metaAssets).reduce(
    (acc, asset, i) => {
      const mappedAsset = metaAssets[i]
      if (mappedAsset?.altText) {
        acc[mappedAsset.altText.toLowerCase() as 'logo' | 'header' | 'navbar'] = asset
      }

      return acc
    },
    {} as { logo: ShopImageSrcSet; navbar: ShopImageSrcSet; header: ShopImageSrcSet },
  )

  return mapSingleShopifyProductToProps({
    product: data,
    images: productImages,
    metaAssetMap,
    lockedImages: [],
    sizeChart: [],
  })
}

export function getImageSizeMap(data: (FragmentProductImageFragment | FragmentProductVideoFragment)[]) {
  return data.reduce((acc, item) => {
    if (item?.__typename !== 'Image') return acc

    const { url, ...urls } = item
    acc.push({
      defaultUrl: url,
      '500': { '1x': urls.url500, '2x': urls.url500_2x, '3x': urls.url500_3x },
      '720': { '1x': urls.url720, '2x': urls.url720_2x, '3x': urls.url720_3x },
      '960': { '1x': urls.url960, '2x': urls.url960_2x, '3x': urls.url960_3x },
      '1280': { '1x': urls.url1280, '2x': urls.url1280_2x, '3x': urls.url1280_3x },
      '1440': { '1x': urls.url1440, '2x': urls.url1440_2x, '3x': urls.url1440_3x },
    })

    return acc
  }, [] as ShopImageSrcSet[])
}

export function sizeToFullSize(size: ProductSizes): string {
  switch (size) {
    case ProductSizes.S:
      return 'small'
    case ProductSizes.M:
      return 'medium'
    case ProductSizes.L:
      return 'large'
    case ProductSizes.XL:
      return 'x-large'
  }
}

export const sizeToFullSizeCapitalised = (size: ProductSizes): string => {
  const sizeSmall = sizeToFullSize(size)
  return sizeSmall.toUpperCase()
}

interface ReducedShowcaseVideos {
  [x: string]: FragmentProductVideoFragment
}

export function reduceShopifyMediaToShowcaseVideos(
  acc: Record<string, FragmentProductVideoFragment>,
  media: FragmentProductVideoFragment,
): ReducedShowcaseVideos {
  if (media?.id && media?.alt) {
    acc[media.alt] = media
  }

  return acc
}
export type ShopifyIdType = 'Product' | 'Collection' | 'Image' | 'Video'
export type ShopifyId<T extends ShopifyIdType> = `gid://shopify/${T}/${string | number}`
export function getShopifyId<T extends ShopifyIdType>(id: string | null, type: T): ShopifyId<T> | '' {
  const idIsAlreadyFormed = !!id?.match(`gid://shopify/${type}/`)
  const idAsNum = Number(id)

  if (idIsAlreadyFormed) {
    return id as ShopifyId<T>
  } else if (!!id && !!idAsNum) {
    return `gid://shopify/${type}/${idAsNum}`
  } else {
    return ''
  }
}
export function shortenShopifyId<T extends ShopifyIdType>(
  longId: T | string | number | undefined | null,
  type: T,
): string | '' {
  const idIsAlreadyFormed = !!Number(longId)

  if (!!longId && idIsAlreadyFormed) {
    return longId.toString()
  } else if (typeof longId === 'string') {
    return longId.replace(`gid://shopify/${type}/`, '')
  } else {
    return ''
  }
}

export function mapShopifyProductVariantToGA(
  item: ProductVariantQuery['product'] | FragmentCartLineFragment['merchandise'],
  quantity: number,
  category: Category,
) {
  const product =
    (item as ProductVariantQuery['product'])?.variantBySelectedOptions ||
    (item as FragmentCartLineFragment['merchandise'])

  if (!product) return null

  return [
    product,
    {
      item_sku: product?.sku,
      item_id: product?.id,
      item_name: product?.product?.handle,
      item_brand: 'PASTELLE APPAREL',
      item_category: category,
      price: product?.priceV2?.amount ? parseFloat(product.priceV2.amount) : null,
      item_variant: product?.selectedOptions
        ?.map((options: { name: string; value: unknown }) => options.name + '-' + options.value)
        .join(', '),
      item_category_2: product?.product?.tags?.[0],
      item_category_3: product?.product?.tags?.[1],
      item_category_4: product?.product?.tags?.[2],
      item_category_5: product?.product?.tags?.[3],
      quantity,
    },
  ] as const
}
