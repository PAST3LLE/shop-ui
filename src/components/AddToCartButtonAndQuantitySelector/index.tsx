import { Row } from '@past3lle/components'
import AddToCartButton, { AddToCartButtonParams } from 'components/AddToCartButton'
import useQuantitySelector, { QuantitySelectorParams, QuantitySelectorWrapper } from 'hooks/useQuantitySelector'
import { useCurrentProductMedia } from 'state/collection/hooks'
import styled from 'styled-components/macro'

const Wrapper = styled(Row)`
  width: 100%;
  gap: 2rem;
  flex-flow: row wrap;
  align-items: stretch;

  > button {
    flex: 1 1 65%;
  }
  > ${QuantitySelectorWrapper} {
    flex: 1 1 33%;
    padding: 0.5rem;

    > button {
      width: 5rem;
      font-size: 2.5rem;
    }
    > button,
    > input {
      border-radius: 0.5rem;
    }
    > input[type='number'] {
      width: min-content;
    }
  }
`
export default function AddToCartButtonAndQuantitySelector({
  merchandiseId,
  children,
  quantitySelectorProps,
}: Pick<AddToCartButtonParams, 'merchandiseId'> & {
  children?: React.ReactNode
  quantitySelectorProps: QuantitySelectorParams
}) {
  const { quantity, QuantitySelector } = useQuantitySelector(quantitySelectorProps)
  const { color, navLogoSet } = useCurrentProductMedia()

  return (
    <Wrapper>
      <AddToCartButton
        merchandiseId={merchandiseId}
        quantity={quantity}
        buttonProps={{ bgImage: navLogoSet, backgroundColor: color || '#000' }}
      />
      <QuantitySelector color={color} />
      {children}
    </Wrapper>
  )
}
