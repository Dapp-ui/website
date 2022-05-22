import React from 'react'
import { useConnectWallet, useSetChain } from '@web3-onboard/react'
import { shortenAddress } from 'helpers'

import { Button } from 'components/inputs'

import s from './ConnectButton.module.scss'


const allowedChainIds = [ 250 ]

const ConnectButton: React.FC = () => {
  const [ { wallet, connecting }, connect, disconnect ] = useConnectWallet()
  const [ { connectedChain }, setChain ] = useSetChain()

  const chainId = connectedChain?.id ? parseInt(connectedChain?.id) : null

  if (chainId && !allowedChainIds.includes(chainId)) {
    const changeNetwork = async () => {
      const hexChainId = `0x${Number(250).toString(16)}`

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: hexChainId,
            },
          ],
        })

        setChain({ chainId: hexChainId })
      }
      catch (err) {
        console.error(err)

        // This error code indicates that the chain has not been added to MetaMask.
        if (err.code === 4902 || err.data?.originalError?.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [ {
                chainId: hexChainId,
                chainName: 'Fantom Opera',
                nativeCurrency: { name: 'FTM', symbol: 'FTM', decimals: 18 },
                rpcUrls: [ 'https://rpc.ftm.tools' ],
                blockExplorerUrls: [ 'https://ftmscan.com' ],
              } ],
            })

            setChain({ chainId: hexChainId })
          }
          catch {
            console.error(`failed to add "${chainId}" chain to a wallet.`)
          }
        }
      }
    }

    return (
      <Button
        className={s.wrongNetworkButton}
        size={44}
        onClick={changeNetwork}
      >
        Wrong network
      </Button>
    )
  }

  if (wallet) {
    return (
      <Button
        size={44}
        style="secondary"
        onClick={() => disconnect(wallet)}
      >
        {`${shortenAddress(wallet.accounts[0].address)} (Disconnect)`}
      </Button>
    )
  }

  return (
    <Button
      size={44}
      style="primary"
      disabled={connecting}
      onClick={() => connect({})}
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
}

export default ConnectButton
