import { Row, RowProps } from '@past3lle/components'
import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import { PNG_LogoCircle_2x } from '@past3lle/assets'
import { Text } from '@/components/Text'

export function SaleBanner(props: RowProps) {
  const isMobileWidth = useIsExtraSmallMediaWidth()
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
      <img
        src={PNG_LogoCircle_2x as unknown as string}
        style={{ marginLeft: 'auto', height: isMobileWidth ? '80%' : '100%' }}
      />
      <Text.ProductText fontSize={isMobileWidth ? '1.75rem' : '2.25rem'} marginLeft="1rem" fontWeight={700}>
        {isMobileWidth ? process.env.NEXT_PUBLIC_SALE_MOBILE : process.env.NEXT_PUBLIC_SALE}
      </Text.ProductText>
      <div style={{ margin: '0 1rem 0 auto', cursor: 'pointer', fontWeight: 800, fontSize: '1.5rem' }}>X</div>
    </Row>
  )
}
