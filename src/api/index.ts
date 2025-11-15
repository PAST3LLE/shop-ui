import { DEFAULT_CART_LINES_AMOUNT, PRODUCT_IMAGES_AMOUNT, PRODUCT_VIDEOS_AMOUNT } from '@/constants/config'
import { createCart, queryCart } from '@/shopify/graphql/api/cart'
import { formattedCollectionQuery } from '@/shopify/graphql/api/collection'
import { ProductCollectionSortKeys } from '@/shopify/graphql/types'
import { shortenShopifyId, ShopifyIdType } from '@/shopify/utils'
import { AppStore } from '@/state'
import { updateCartInfo } from '@/state/cart/reducer'
import { updateCollections, updateCurrentCollection } from '@/state/collection/reducer'
import { devDebug } from '@past3lle/utils'

export async function fetchLatestCollectionAndUpdateStore(store: AppStore) {
  const collections = await formattedCollectionQuery({
    collectionAmount: 1,
    // always show the latest collection
    productAmt: 10,
    imageAmt: PRODUCT_IMAGES_AMOUNT,
    videoAmt: PRODUCT_VIDEOS_AMOUNT,
    // reverse array to get first as latest
    reverse: true,
    productReverse: true,
    productSortKey: ProductCollectionSortKeys.BestSelling,
  })

  if (collections.length > 0) {
    const formattedCollections = collections.map(({ collectionProductMap, locked, id, title }) => ({
      products: collectionProductMap,
      locked,
      id: shortenShopifyId(id as ShopifyIdType, 'Collection'),
      title,
    }))

    store.dispatch(
      updateCollections({
        collections: formattedCollections,
        loading: false,
      }),
    )

    if (formattedCollections?.[0]?.id) {
      store.dispatch(
        updateCurrentCollection({
          id: formattedCollections[0].id,
          locked: formattedCollections[0]?.locked,
          loading: false,
        }),
      )
    }
  }

  return collections
}

export async function getExistingOrCreateCartAndUpdateStore(store: AppStore) {
  try {
    const { cartId } = store.getState().cart
    if (cartId) {
      const cart = await queryCart({ cartId, linesAmount: DEFAULT_CART_LINES_AMOUNT })
      if (!cart || cart === null) throw new CartQueryError('EMPTY_CART')
      devDebug('[CART UPDATER::PREVIOUS CART SUB-UPDATER] --> Previous cart found! Setting.')
      updateCartInfo({
        cartId: cart.id,
        totalQuantity: cart.totalQuantity,
        costs: cart.cost,
      })
    } else await _createAndDispatchCart(store)
  } catch (error) {
    if (error instanceof CartQueryError && error.type === 'EMPTY_CART') {
      devDebug('[CART UPDATER] --> EMPTY_CART - INITIATING NEW CART!')
      await _createAndDispatchCart(store)
    } else {
      throw error
    }
  }
}

async function _createAndDispatchCart(store: AppStore) {
  const cartInfo = await createCart()
  if (!cartInfo?.cart?.id) throw new Error('Missing cart ID')
  return store.dispatch(updateCartInfo({ cartId: cartInfo?.cart?.id }))
}

class CartQueryError extends Error {
  public type: string
  constructor(type: string) {
    super('Cart query error ' + type)
    this.type = type
  }
}
