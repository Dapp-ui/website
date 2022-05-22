import React from 'react'
import { useQuery } from 'hooks'
import axios from 'axios'
import { vaults } from 'helpers'


type Response = {
  address: string
  symbol: string
  tvl: {
    tvl: number
  }
  apy: {
    gross_apr: number
    net_apy: number
  }
}[]

export type VaultsContextState = {
  isVaultsFetching: boolean
  vaultAddresses: string[]
  vaultsMap: Record<string, {
    protocol: string
    address: string
    apy: number
  }>
}

const Context = React.createContext<VaultsContextState>(null)

export const useVaults = () => React.useContext(Context)

export const VaultsProvider = ({ children }) => {
  const fetcher = async () => {
    const { data } = await axios.get<Response>('https://api.yearn.finance/v1/chains/1/vaults/all')

    const dataMap = data.reduce((acc, item) => {
      acc[item.address] = item
      return acc
    }, {} as Record<string, Response[number]>)

    return vaults.reduce((acc, item) => {
      const data = dataMap[item.address]
      const apy = data?.apy?.gross_apr || null

      if (!apy) {
        console.error(`APY doesn't exist for "${item.protocol} / ${item.address}"`)
      }

      acc[item.address] = {
        ...item,
        apy,
      }

      return acc
    }, {})
  }

  const { isFetching, data } = useQuery({
    endpoint: 'aprs',
    fetcher,
  })

  const context = {
    isVaultsFetching: isFetching,
    vaultAddresses: data && Object.keys(data),
    vaultsMap: data,
  }

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  )
}
