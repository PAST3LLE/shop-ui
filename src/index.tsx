import 'inter-ui'
import './i18n'

import { StrictMode } from 'react'

// PROVIDERS
import Web3ReactProvider from 'blockchain/providers/Web3Provider'
import { Provider } from 'react-redux'
import ApolloProvider from 'shopify/graphql/ApolloProvider'
import ThemeProvider from 'theme'

import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import App from './pages/App'

import store from 'state'
// BC UPDATERS
import BlockchainUpdater from 'state/blockchain/updater'
import TransactionUpdater from 'state/blockchainTransactions/updater'
// PASTELLE STORE UPDATERS
import CartUpdater from 'state/cart/updater'
import CollectionUpdater from 'state/collection/updater'
import WindowSizeUpdater from 'state/window/updater'

import { TopGlobalStyle, ThemedGlobalComponent, FontStyles } from 'theme/styles/global'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { nodeRemoveChildFix } from 'utils/node'
import { devLog } from 'utils/logging'
import { isWeb3Enabled } from 'blockchain/connectors'

// Node removeChild hackaround
// based on: https://github.com/facebook/react/issues/11538#issuecomment-417504600
nodeRemoveChildFix()

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function PastelleStoreUpdaters() {
  return (
    <>
      <CartUpdater />
      <WindowSizeUpdater />
      <CollectionUpdater />
    </>
  )
}

function BlockchainUpdaters() {
  const isEnabled = isWeb3Enabled()

  if (!isEnabled) return null

  return (
    <>
      <BlockchainUpdater />
      <TransactionUpdater />
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <StrictMode>
    {/* Provides all top level CSS NOT dynamically adjustable by the ThemeProvider */}
    <FontStyles />
    <TopGlobalStyle />
    <ApolloProvider>
      <Provider store={store}>
        <HashRouter>
          <Web3ReactProvider>
            <PastelleStoreUpdaters />
            <BlockchainUpdaters />
            <ThemeProvider>
              {/* Provides all top level CSS dynamically adjustable by the ThemeProvider */}
              <ThemedGlobalComponent />
              <App />
            </ThemeProvider>
          </Web3ReactProvider>
        </HashRouter>
      </Provider>
    </ApolloProvider>
  </StrictMode>
)

async function deleteAllCaches() {
  const cacheNames = (await caches.keys()) || []

  cacheNames.map(cacheName => {
    devLog('[worker] Delete cache', cacheName)
    // Delete old caches
    // https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker#removing_outdated_caches
    return caches.delete(cacheName)
  })
}

async function unregisterAllWorkers() {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (const registration of registrations) {
      registration.unregister()
    }
  })
}

if ('serviceWorker' in navigator) {
  devLog('[worker] Unregister worker...')
  serviceWorkerRegistration.unregister()

  devLog('[worker] Deleting all caches...')
  deleteAllCaches()
    .then(() => devLog('[worker] All caches have been deleted'))
    .catch(console.error)

  devLog('[worker] Unregistering all workers...')
  unregisterAllWorkers()
    .then(() => devLog('[worker] All workers have been unregistered'))
    .catch(console.error)
}
