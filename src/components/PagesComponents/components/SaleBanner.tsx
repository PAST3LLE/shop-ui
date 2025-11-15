import { Row, RowProps } from '@past3lle/components'
import { PNG_LogoCircle_2x } from '@past3lle/assets'
import { Text } from '@/components/Text'

export function SaleBanner(props: RowProps) {
  return (
    <Row
      justifyContent="center"
      padding="2px"
      textAlign="center"
      width="100%"
      height={40}
      backgroundColor="cornflowerblue"
      gap="0.5rem"
      {...props}
    >
      <img src={PNG_LogoCircle_2x as unknown as string} />
      <Text.ProductText fontSize="2.5rem">{process.env.NEXT_PUBLIC_SALE}</Text.ProductText>
    </Row>
  )
}
