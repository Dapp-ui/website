import React, { useEffect } from 'react'
import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import walletconnectWalletModule from '@web3-onboard/walletconnect'
import { RPC_PROVIDER } from 'contracts'


const injected = injectedModule()
const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: false })
const wcWalletSdk = walletconnectWalletModule({})

const web3Onboard = init({
  wallets: [
    injected,
    coinbaseWalletSdk,
    wcWalletSdk,
  ],
  chains: [
    {
      id: '0xfa',
      token: 'FTM',
      label: 'Fantom',
      rpcUrl: RPC_PROVIDER,
    },
  ],
  appMetadata: {
    name: 'IndexClub',
    icon: '/images/logo.svg',
    logo: '/images/logo.svg',
    description: 'Create your own Indexes for most popular vaults',
    recommendedInjectedWallets: [
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
      { name: 'MetaMask', url: 'https://metamask.io' },
    ],
  },
  accountCenter: {
    desktop: {
      enabled: false,
    },
  },
})

const WalletContainer: React.FC<React.PropsWithChildren<any>> = ({ children }) => {

  useEffect(() => {
    const walletsSub = web3Onboard.state.select('wallets')

    const { unsubscribe } = walletsSub.subscribe((wallets) => {
      const connectedWallets = wallets.map(({ label }) => label)

      window.localStorage.setItem('connectedWallets', JSON.stringify(connectedWallets))
    })

    return () => {
      // unsubscribe()
    }
  }, [])

  useEffect(() => {
    (async () => {
      const storageValue = window.localStorage.getItem('connectedWallets') || null
      const previouslyConnectedWallets = JSON.parse(storageValue)

      if (previouslyConnectedWallets?.length) {
        try {
          await web3Onboard.connectWallet({
            autoSelect: {
              label: previouslyConnectedWallets[0],
              disableModals: true,
            },
          })
        }
        catch (err) {
          console.error(err)
        }
      }
    })()
  }, [])

  return children
}

export default WalletContainer
