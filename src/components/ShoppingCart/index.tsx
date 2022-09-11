import { ShoppingCart as ShoppingCartIcon, X } from 'react-feather'

import { Row } from 'components/Layout'
import LoadingRows from 'components/Loader/LoadingRows'
import SmartImg from 'components/SmartImg'
import { ItemHeader, ItemSubHeader, Strikethrough } from 'pages/SingleItem/styleds'
import { useQueryCart } from 'shopify/graphql/hooks'
import { FragmentCartLineFragment, ProductBrandingAssets } from 'shopify/graphql/types'
import { useGetCartDispatch, useGetCartIdDispatch } from 'state/cart/hooks'
import { CartState } from 'state/cart/reducer'
import { useMemo, useState } from 'react'
import {
  CartLineContent,
  CartLineWrapper,
  ShoppingCartPanelContentWrapper,
  ShoppingCartPanelWrapper,
  ShoppingCartQuantityWrapper,
  ShoppingCartWrapper
} from './styled'
import useQuantitySelector from 'hooks/useQuantitySelector'
import { getThemeColours } from 'theme/utils'
import { ThemeModes } from 'theme/styled'
import { getMetafields } from 'shopify/utils'

const WHITE = getThemeColours(ThemeModes.CHAMELEON).offWhite

function ShoppingCartQuantity({ totalQuantity }: Pick<CartState, 'totalQuantity'>) {
  return <ShoppingCartQuantityWrapper>{totalQuantity}</ShoppingCartQuantityWrapper>
}

// Icon and count to show in header
export function ShoppingCartHeader() {
  const [shoppingPanelOpen, setShoppingPanelOpen] = useState(false)
  const cart = useGetCartDispatch()
  return (
    <>
      <ShoppingCartWrapper onClick={() => setShoppingPanelOpen(true)}>
        <ShoppingCartIcon size={'3rem'} />
        <ShoppingCartQuantity totalQuantity={cart.totalQuantity} />
      </ShoppingCartWrapper>
      {shoppingPanelOpen && <ShoppingCart closeCartPanel={() => setShoppingPanelOpen(false)} />}
    </>
  )
}

// Standalone shopping cart panel
export function ShoppingCart({ closeCartPanel }: { closeCartPanel: () => void }) {
  const cartId = useGetCartIdDispatch()
  if (!cartId) return null
  return <ShoppingCartPanel cartId={cartId} closeCartPanel={closeCartPanel} />
}

const LINES_AMOUNT = 20
function ShoppingCartPanel({ cartId, closeCartPanel }: { cartId: string; closeCartPanel: () => void }) {
  const { data, loading } = useQueryCart({ cartId, linesAmount: LINES_AMOUNT })
  const cartLines = data?.cart?.lines.nodes

  const isEmptyCart = !Boolean(cartLines?.length)

  return (
    <ShoppingCartPanelWrapper>
      <ShoppingCartPanelContentWrapper>
        <Row>
          <ItemHeader margin={'1rem auto 0 0'} color={WHITE} itemColor={'transparent'}>
            CART
          </ItemHeader>
          <Strikethrough />
          <X size={'5rem'} color={WHITE} onClick={closeCartPanel} />
        </Row>
        {loading ? (
          <LoadingRows rows={3} $height={'14rem'} $padding="1rem" $margin="1rem 0" />
        ) : isEmptyCart ? (
          <h1>Cart is empty :( Buy something!</h1>
        ) : (
          cartLines?.map(line => <CartLine key={line.id} line={line} />)
        )}
      </ShoppingCartPanelContentWrapper>
    </ShoppingCartPanelWrapper>
  )
}

function CartLine({ line }: { line: FragmentCartLineFragment }) {
  const { QuantitySelector } = useQuantitySelector({ defaultQuantity: line.quantity })
  const { brandAssetMap, color } = useMemo(
    () => ({
      brandAssetMap: getMetafields<ProductBrandingAssets | undefined>(line.merchandise.product.brandingAssetMap),
      color: getMetafields<string>(line.merchandise.product.color)
    }),
    [line.merchandise.product.brandingAssetMap, line.merchandise.product.color]
  )

  const auxAssetMap = {
    ...brandAssetMap,
    header: brandAssetMap?.logo || brandAssetMap?.header || brandAssetMap?.navBar
  }

  return (
    <CartLineWrapper brandAssetMap={auxAssetMap} color={color}>
      <div>
        {/* 1 */}
        {/* <SMART IMG SPAN />*/}
        {/* 2 */}
        <SmartImg defaultPath={line.merchandise.product.images.nodes[0].url} />
        {/* 3 */}
        <CartLineContent>
          <ItemSubHeader color={WHITE} fontSize={'3rem'} fontWeight={1000}>
            {line?.merchandise.product.title} - {line?.merchandise.size}
          </ItemSubHeader>
          <QuantitySelector />
        </CartLineContent>
      </div>
    </CartLineWrapper>
  )
}