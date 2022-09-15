import { Connector } from '@web3-react/types'
import { gnosisSafeConnection, networkConnection } from 'blockchain/connectors'
import { getConnection } from 'blockchain/connectors/utils'
import { useEffect } from 'react'
import { BACKFILLABLE_WALLETS } from 'blockchain/connectors/constants'
import { useAppSelector } from 'state'

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
  } catch (error) {
    console.debug(`EAGER CONNECTION ERROR: ${error}`)
  }
}

export default function useEagerlyConnect() {
  const selectedWalletBackfilled = useAppSelector(state => state.blockchain.selectedWalletBackfilled)
  const selectedWallet = useAppSelector(state => state.blockchain.selectedWallet)

  useEffect(() => {
    connect(gnosisSafeConnection.connector)
    connect(networkConnection.connector)

    if (selectedWallet) {
      connect(getConnection(selectedWallet).connector)
    } else if (!selectedWalletBackfilled) {
      BACKFILLABLE_WALLETS.map(getConnection)
        .map(connection => connection.connector)
        .forEach(connect)
    }
    // The dependency list is empty so this is only run once on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}