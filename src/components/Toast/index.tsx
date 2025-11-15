import styled from 'styled-components/macro'

import { PNG_LogoCircle_2x } from '@past3lle/assets'
import { Row } from '@past3lle/components'
import { Text } from '../Text'

interface ToastProps {
  header?: string
  body: string
  isMobile: boolean
}

export function PastelleToast({ header, body, isMobile }: ToastProps) {
  return (
    <ToastContainer isMobile={isMobile}>
      <Row>
        <img src={PNG_LogoCircle_2x as unknown as string} />
        {header !== undefined && <Text.Main>{header}</Text.Main>}
      </Row>
      <Text.ProductText className="toast-body-text" backgroundColor="#564461ff">{body}</Text.ProductText>
    </ToastContainer>
  )
}

const ToastContainer = styled.div<{ isMobile: boolean }>`
  gap: 0.5rem;
  > ${Row} > ${Text.Main} {
    font-size: 1.5rem;
    color: ghostwhite;
  }
  img {
    width: ${(props) => (props.isMobile ? '12%' : '20%')};
    height: auto;
    margin-right: 1rem;
  }

  > div.toast-body-text {
    margin-top: 0.5rem;
    color: ghostwhite;
    font-weight: 900;
    border-radius: 3px;
    padding: 1px 8px;
    width: auto;
    font-size: ${(props) => (props.isMobile ? '3.2rem' : '2.5rem')};
    text-align: center;
  }
`
