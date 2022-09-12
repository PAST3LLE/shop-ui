import { ProductSizes } from 'shopify/graphql/types'

export const CURRENT_DROP = 1
export const DEFAULT_CATALOG_URL = `/drop-${CURRENT_DROP}/catalog`

export const STORE_IMAGE_SIZES = {
  LARGE: 2000,
  SMALL: 600
}

export const CATALOG_MAX_WIDTH = 1950
export const FIXED_IMAGE_SIZE_CONSTRAINTS = {
  fromLarge: '38vw',
  fromExtraLarge: '38vw'
}
export const DEFAULT_SIZE_SELECTED: ProductSizes = ProductSizes.L

export const DEFAULT_IK_TRANSFORMS = {
  LQ: 'pr-true,q-10',
  HQ: 'pr-true',
  LQ_LOGO: 'pr-true,q-10',
  HQ_LOGO: 'pr-true,q-90'
}

export const enum Z_INDEXES {
  BEHIND = -1,
  ZERO = 0,
  MENU_FLYOUT = 100,
  PRODUCT_CONTENT = 100,
  PRODUCT_VIDEOS = 200,
  NAV_MENU = 200,
  SHOPPING_CART = 300,
  SCROLLER_DIV = 900,
  MODALS = 9999
}
export const DEFAULT_CART_LINES_AMOUNT = 30
