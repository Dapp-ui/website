import React from 'react'
import { useQuery } from 'hooks'
import { getVaultContract } from 'contracts'
import { yearnSdk } from 'helpers'
import type { Vault } from '@yfi/sdk'

import supportedVaults from './supportedVaults'


export type VaultsContextState = {
  isVaultsFetching: boolean
  vaultAddresses: string[]
  vaultsMap: Record<string, {
    protocol: string
    tokenName: string
    address: string
    apy: number
  }>
}

const Context = React.createContext<VaultsContextState>(null)

export const useVaults = () => React.useContext(Context)

export const VaultsProvider = ({ children }) => {
  const fetcher = async () => {
    const cacheKey = 'index-club-vaults-cache'
    let storageValue = localStorage.getItem(cacheKey)

    if (storageValue) {
      const { createdAt, data } = JSON.parse(storageValue)

      // less than 10 min
      if (Date.now() - createdAt < 10 * 60 * 60 * 1000) {
        return data
      }
    }

    const data = await yearnSdk.vaults.get()

    const dataMap = data.reduce((acc, item) => {
      acc[item.address.toLowerCase()] = item
      acc[item.token.toLowerCase()] = item
      return acc
    }, {} as Record<string, Vault>)

    const mappedData = await Promise.all(
      supportedVaults.map(async (vault) => {
        let data
        let tokenName: string
        let apy: number

        try {
          data = dataMap[vault.address.toLowerCase()]
        }
        catch (err) {
          console.error(err)
        }

        if (data) {
          tokenName = data.name
          apy = data.metadata?.apy?.gross_apr || null
        }

        if (!tokenName) {
          const vaultContract = getVaultContract(vault.address)
          tokenName = await vaultContract.name()
        }

        if (!apy) {
          console.warn(`APY doesn't exist for "${vault.protocol} / ${vault.address}"`, data)
          apy = vault.apy
        }
        else {
          apy = +Number(apy * 100).toFixed(2)
        }

        return {
          ...vault,
          tokenName,
          apy,
        }
      })
    )

    const result = mappedData.reduce((acc, item) => {
      acc[item.address] = item
      return acc
    }, {})

    localStorage.setItem(cacheKey, JSON.stringify({ createdAt: Date.now(), data: result }))

    return result
  }

  const { isFetching, data } = useQuery({
    endpoint: 'vaults',
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
