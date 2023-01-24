import { BigNumber } from '@ethersproject/bignumber'
import { hexStripZeros } from '@ethersproject/bytes'
import { Web3Provider } from '@ethersproject/providers'
import { devError } from '@past3lle/utils'
import { L1ChainInfo, L2ChainInfo, SupportedChainId } from 'blockchain/constants/chains'

interface AddNetworkArguments {
  library: Web3Provider
  chainId: SupportedChainId
  info: L1ChainInfo | L2ChainInfo
}

// provider.request returns Promise<any>, but wallet_switchEthereumChain must return null or throw
// see https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md for more info on wallet_switchEthereumChain
export async function addNetwork({ library, chainId, info }: AddNetworkArguments): Promise<null | void> {
  if (!library?.provider?.request) {
    return
  }
  const formattedChainId = hexStripZeros(BigNumber.from(chainId).toHexString())
  try {
    await library?.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: formattedChainId,
          chainName: info.label,
          rpcUrls: info.rpcUrls,
          nativeCurrency: info.nativeCurrency,
          blockExplorerUrls: [info.explorer],
        },
      ],
    })
  } catch (error) {
    devError('error adding eth network: ', chainId, info, error)
  }
}
