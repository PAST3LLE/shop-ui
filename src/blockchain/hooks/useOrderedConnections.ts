import { ConnectionType } from 'blockchain/connectors'
import { getConnection } from 'blockchain/connectors/utils'
import { useMemo } from 'react'
import { BACKFILLABLE_WALLETS } from 'blockchain/connectors/constants'
import { useAppSelector } from 'state'

const SELECTABLE_WALLETS = [...BACKFILLABLE_WALLETS]

export default function useOrderedConnections() {
  const selectedWallet = useAppSelector(state => state.blockchain.selectedWallet)
  return useMemo(() => {
    const orderedConnectionTypes: ConnectionType[] = []

    // Always attempt to use to Gnosis Safe first, as we can't know if we're in a SafeContext.
    orderedConnectionTypes.push(ConnectionType.GNOSIS_SAFE)

    // Add the `selectedWallet` to the top so it's prioritized, then add the other selectable wallets.
    if (selectedWallet) {
      orderedConnectionTypes.push(selectedWallet)
    }
    orderedConnectionTypes.push(...SELECTABLE_WALLETS.filter(wallet => wallet !== selectedWallet))

    // Add network connection last as it should be the fallback.
    orderedConnectionTypes.push(ConnectionType.NETWORK)

    return orderedConnectionTypes.map(getConnection)
  }, [selectedWallet])
}
