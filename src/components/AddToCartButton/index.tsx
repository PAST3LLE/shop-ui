import { Button, ButtonProps, ButtonSizeVariations, ButtonVariations, Row } from '@past3lle/components'
import { addToCartAnalytics } from '@/analytics/events/cartEvents'
import ErrorMessage from '@/components/ErrorMessage'
import { TRANSPARENT_HEX } from '@/constants/config'
import { LAYOUT_REM_HEIGHT_MAP } from '@/constants/sizes'
import { ProductDescription } from '@/components/PagesComponents/styleds'
import { ForwardedRef, forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import { ProductVariantQuery } from '@/shopify/graphql/types'
import { useAddLineToCartAndUpdateReduxCallback } from '@/state/cart/hooks'
import styled from 'styled-components/macro'

export interface SpecialThemedButtonProps extends ButtonProps {
  hoverFilter?: string
  innerBgColor?: string
  innerOpacity?: number
  innerFilter?: string
  innerHoverFilter?: string
}
export type AddToCartButtonParams = {
  label?: string
  asyncLabel?: string
  product: ProductVariantQuery['product']
  quantity: number
  skillLocked: boolean
  buttonProps?: SpecialThemedButtonProps
  callback?: (...args: unknown[]) => void
}

const DisappearingMessageWrapper = styled(ProductDescription)`
  background-color: ${({ theme }) => theme.offwhiteOpaque};
  color: ${({ theme }) => theme.text1};
`
function useDisappearingMessage(params: { message: string; showAtStart?: boolean }) {
  const { message } = params
  const [showMessage, setShow] = useState(!!params?.showAtStart)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showMessage) setShow(false)
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [showMessage])

  const DisappearingMessage = useCallback(
    () =>
      showMessage ? (
        <DisappearingMessageWrapper backgroundColor={TRANSPARENT_HEX} padding="1rem">
          {message}
        </DisappearingMessageWrapper>
      ) : null,
    [showMessage, message],
  )
  return {
    DisappearingMessage,
    setShow,
    shouldShow: showMessage,
    message,
  }
}

const CartButton = styled(Button)<{ innerBgColor?: string; color?: string }>``

const AddToCartButton = forwardRef(function AddToCartButtonNoRef(
  {
    label = 'Add to cart',
    asyncLabel = 'Added to cart!',
    product,
    quantity,
    skillLocked,
    buttonProps = {},
    callback,
  }: AddToCartButtonParams,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
) {
  const { addLineToCartCallback, loading, error } = useAddLineToCartAndUpdateReduxCallback()
  const { message: disappearingMessage, shouldShow, setShow } = useDisappearingMessage({ message: asyncLabel })

  const { isDisabled } = useMemo(() => {
    const isDisabled = loading || !quantity || shouldShow

    return {
      isDisabled,
    }
  }, [loading, quantity, shouldShow])

  const handleAddToCart = useCallback(() => {
    addToCartAnalytics(product, quantity)
    setShow(true)
    addLineToCartCallback({ quantity, merchandiseId: product?.variantBySelectedOptions?.id })
  }, [addLineToCartCallback, product, quantity, setShow])

  const handleLearnMore = useCallback(() => {
    // TODO: analytics submit
    // TODO: navigate to skilltree blog post
    alert('Moving to learn more blog post')
  }, [])

  return (
    <Row ref={forwardedRef} width="100%">
      <CartButton
        onClick={callback ? callback : skillLocked ? handleLearnMore : handleAddToCart}
        disabled={isDisabled}
        buttonVariant={ButtonVariations.THEME}
        buttonSize={ButtonSizeVariations.SMALL}
        height={LAYOUT_REM_HEIGHT_MAP.FIXED_ADD_TO_CART_BUTTON + 'rem'}
        color="black"
        innerBgColor="#ced9d3"
        // override w/ button props if necessary
        {...buttonProps}
      >
        {!error && (
          <ProductDescription
            color="inherit"
            backgroundColor="transparent"
            display={'flex'}
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            fontWeight={buttonProps?.fontWeight}
            fontSize="inherit"
            fontStyle="inherit"
          >
            {skillLocked
              ? 'LOCKED. CLICK TO LEARN MORE.'
              : loading
                ? 'Adding...'
                : shouldShow
                  ? disappearingMessage
                  : label}
          </ProductDescription>
        )}
      </CartButton>
      {error && <ErrorMessage error={error} />}
    </Row>
  )
})

export default AddToCartButton
