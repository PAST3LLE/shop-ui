import { AutoColumn, Button, ColumnCenter, Modal, RowBetween, Text } from '@past3lle/components'
import { ExternalLink } from '@past3lle/components'
import { usePstlConnection } from '@past3lle/web3-modal'
import Circle from 'assets/images/blue-loader.svg'
import { AlertTriangle, ArrowUpCircle } from 'react-feather'
import styled, { useTheme } from 'styled-components/macro'
import { CloseIcon, CustomLightSpinner } from 'theme'
import { getEtherscanLink } from 'utils/blockchain'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`

const BottomSection = styled(Section)`
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

function ConfirmationPendingContent({ onDismiss, pendingText }: { onDismiss: () => void; pendingText: string }) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <Text.Basic fontWeight={500} fontSize={20}>
            Waiting For Confirmation
          </Text.Basic>
          <AutoColumn gap="12px" justify={'center'}>
            <Text.Basic fontWeight={600} fontSize={14} color="" textAlign="center">
              {pendingText}
            </Text.Basic>
          </AutoColumn>
          <Text.Basic fontSize={12} color="#565A69" textAlign="center">
            Confirm this transaction in your wallet
          </Text.Basic>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId?: number
}) {
  const theme = useTheme()

  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <Text.Basic fontWeight={500} fontSize={20}>
            Transaction Submitted
          </Text.Basic>
          {chainId && hash && (
            <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
              <Text.Basic fontWeight={500} fontSize={14} color={theme.primary1}>
                View on Etherscan
              </Text.Basic>
            </ExternalLink>
          )}
          <Button onClick={onDismiss} margin="20px 0 0 0">
            <Text.Basic fontWeight={500} fontSize={20}>
              Close
            </Text.Basic>
          </Button>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent,
}: {
  title: string
  onDismiss: () => void
  topContent: () => JSX.Element
  bottomContent: () => JSX.Element
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text.Basic fontWeight={500} fontSize={20}>
            {title}
          </Text.Basic>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        {topContent()}
      </Section>
      <BottomSection gap="12px">{bottomContent()}</BottomSection>
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const theme = useTheme()
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text.Basic fontWeight={500} fontSize={20}>
            Error
          </Text.Basic>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
          <Text.Basic fontWeight={500} fontSize={16} color={theme.red1} style={{ textAlign: 'center', width: '85%' }}>
            {message}
          </Text.Basic>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <Button onClick={onDismiss}>Dismiss</Button>
      </BottomSection>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
}: ConfirmationModalProps) {
  const [, , { chainId }] = usePstlConnection()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight="90vh" maxWidth="42rem">
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent chainId={chainId} hash={hash} onDismiss={onDismiss} />
      ) : (
        content()
      )}
    </Modal>
  )
}
