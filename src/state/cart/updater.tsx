import { useApolloClient } from '@apollo/client'
import { devDebug, devError } from '@past3lle/utils'
import { DEFAULT_CART_LINES_AMOUNT } from '@/constants/config'
import { useEffect } from 'react'
import { useCreateCart } from '@/shopify/graphql/hooks'
import { GET_CART } from '@/shopify/graphql/queries/cart'
import { GetCartQuery, GetCartQueryVariables } from '@/shopify/graphql/types'
import { useGetCartIdState, useToggleCartAndState, useUpdateCartInfoDispatch } from '@/state/cart/hooks'

import { UpdateCartInfoParams } from './reducer'

interface CartCreationCbs {
  createCart: ReturnType<typeof useCreateCart>[0]
  updateCartInfo: (params: UpdateCartInfoParams) => void
  toggleCartOptions: ReturnType<typeof useToggleCartAndState>
}

export default function CartUpdater() {
  const { query } = useApolloClient()
  const [createCart] = useCreateCart()
  const updateCartInfo = useUpdateCartInfoDispatch()
  const toggleCartOptions = useToggleCartAndState()

  const cartId = useGetCartIdState()

  useEffect(() => {
    async function initCart(cartId: string | null | undefined) {
      try {
        await (cartId
          ? _queryAndUpdateCart({ cartId, query, updateCartInfo })
          : _createAndSaveCart({ createCart, updateCartInfo, toggleCartOptions }))
      } catch (error) {
        if (error instanceof CartQueryError && error.type === 'EMPTY_CART') {
          devDebug('[CART UPDATER] --> EMPTY_CART - INITIATING NEW CART!')
          _createAndSaveCart({ createCart, updateCartInfo, toggleCartOptions })
        } else {
          throw error
        }
      }
    }

    initCart(cartId)
  }, [cartId, createCart, query, updateCartInfo, toggleCartOptions])

  return null
}

interface QueryCartParams {
  cartId: string
  query: ReturnType<typeof useApolloClient>['query']
  updateCartInfo: (params: UpdateCartInfoParams) => void
}

function _queryAndUpdateCart({ cartId, query, updateCartInfo }: QueryCartParams) {
  return query<GetCartQuery, GetCartQueryVariables>({
    query: GET_CART,
    variables: { cartId, linesAmount: DEFAULT_CART_LINES_AMOUNT },
  })
    .then(({ data, error }) => {
      if (error) throw new CartQueryError('QUERY_ERROR')
      else if (!data?.cart || data?.cart === null) throw new CartQueryError('EMPTY_CART')

      devDebug('[CART UPDATER::PREVIOUS CART SUB-UPDATER] --> Previous cart found! Setting.')
      updateCartInfo({
        cartId: data.cart.id,
        totalQuantity: data.cart.totalQuantity,
        costs: data.cart.cost,
      })
    })
    .catch((error) => {
      throw error
    })
}

async function _createAndSaveCart({ updateCartInfo, createCart, toggleCartOptions: [state, setter] }: CartCreationCbs) {
  if (state) setter(false, null)

  return createCart()
    .then(({ data: cartResponse }) => {
      const cart = cartResponse?.cartCreate?.cart

      if (cart) {
        devDebug('[CART UPDATER::NEW CART SUB-UPDATER] --> New cart initialised!')
        updateCartInfo({ cartId: cart.id })
      }
    })
    .catch((error) => {
      devError('[CART UPDATERS] Cart initialisation error!', error)
    })
}

class CartQueryError extends Error {
  public type: string
  constructor(type: string) {
    super('[cart::updater] Cart query error ' + type)
    this.type = type
  }
}
