import { gql } from '@apollo/client'

import { FRAGMENT_PRODUCT, FRAGMENT_PRODUCT_IMAGE, FRAGMENT_PRODUCT_VIDEO } from '../fragments'

export const QUERY_GET_COLLECTION = gql`
  ${FRAGMENT_PRODUCT}
  ${FRAGMENT_PRODUCT_IMAGE}
  ${FRAGMENT_PRODUCT_VIDEO}
  query getCollection(
    $collectionAmount: Int
    $productAmt: Int
    $imageAmt: Int
    $videoAmt: Int
    $reverse: Boolean
    $collectionSortKey: CollectionSortKeys
    $productReverse: Boolean
    $productSortKey: ProductCollectionSortKeys
  ) {
    collections(first: $collectionAmount, reverse: $reverse, sortKey: $collectionSortKey) {
      nodes {
        id
        title
        handle
        image {
          url
        }
        lockStatus: metafield(namespace: "custom", key: "lock_status") {
          value
        }
        seo {
          title
          description
        }
        products(first: $productAmt, reverse: $productReverse, sortKey: $productSortKey) {
          nodes {
            ...FragmentProduct

            images(first: $imageAmt) {
              nodes {
                ...FragmentProductImage
              }
            }
            media(first: $videoAmt, reverse: true) {
              nodes {
                ...FragmentProductVideo
              }
            }
          }
        }
      }
    }
  }
`
