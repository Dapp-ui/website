import React, { useEffect } from 'react'
import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import { RPC_PROVIDER } from 'contracts'


const injected = injectedModule()
const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: false })

const web3Onboard = init({
  wallets: [
    injected,
    coinbaseWalletSdk,
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
          // Connect the most recently connected wallet (first in the array)
          // await onboard.connectWallet({ autoSelect: previouslyConnectedWallets[0] })

          console.log(333, previouslyConnectedWallets)

          // You can also auto connect "silently" and disable all onboard modals to avoid them flashing on page load
          await web3Onboard.connectWallet({
            autoSelect: {
              label: previouslyConnectedWallets[0],
              disableModals: true,
            },
          })

          // OR - loop through and initiate connection for all previously connected wallets
          // note: This UX might not be great as the user may need to login to each wallet one after the other
          // for (walletLabel in previouslyConnectedWallets) {
          //   await onboard.connectWallet({ autoSelect: walletLabel })
          // }
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
