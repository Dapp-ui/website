import React from 'react'
import injectedModule from '@web3-onboard/injected-wallets'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import { init, useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
import { shortenAddress } from 'helpers'

import { Button } from '@mui/material'


const injected = injectedModule()
const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: false })

const web3Onboard = init({
  wallets: [
    injected,
    coinbaseWalletSdk,
  ],
  chains: [
    {
      id: '0x2a',
      token: 'ETH',
      label: 'Kovan Testnet',
      rpcUrl: 'https://kovan.infura.io/v3/ea1f915397b044ae9020c8635149e105',
    },
  ],
  appMetadata: {
    name: 'IndexClub',
    icon: '/images/logo.svg',
    logo: '/images/logo.svg',
    description: 'Create your own Indexes for most popular vaults',
    recommendedInjectedWallets: [
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
      { name: 'MetaMask', url: 'https://metamask.io' }
    ],
  },
  accountCenter: {
    desktop: {
      enabled: false,
    },
  }
})

const ConnectButton: React.FC = () => {
  const [ { wallet, connecting }, connect, disconnect ] = useConnectWallet()
  const [ { chains, connectedChain, settingChain }, setChain ] = useSetChain()
  const connectedWallets = useWallets()

  if (wallet) {
    return (
      <Button
        variant="outlined"
        size="small"
        onClick={() => disconnect(wallet)}
      >
        {`${shortenAddress(wallet.accounts[0].address)} (Disconnect)`}
      </Button>
    )
  }

  return (
    <Button
      variant="outlined"
      size="small"
      disabled={connecting}
      onClick={() => connect({})}
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
}

export default ConnectButton
