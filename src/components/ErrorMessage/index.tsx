import { ApolloError } from '@apollo/client'
import { ProductSubHeader } from '@/components/PagesComponents/styleds'
import styled from 'styled-components/macro'

const ErrorWrapper = styled(ProductSubHeader)`
  background-color: ${({ theme }) => theme.dangerLight};
  border-radius: ${({ theme }) => theme.button.border.radius};
`

export default function ErrorMessage({ error }: { error: ApolloError | Error }) {
  return (
    <ErrorWrapper padding={'0 2rem'}>
      <p>Something went wrong!</p>
      <p>{error.message}</p>
    </ErrorWrapper>
  )
}
