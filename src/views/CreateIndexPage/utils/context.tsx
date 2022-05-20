import React from 'react'
import { useReducerState } from 'hooks'
import type { SetState } from 'hooks'
import { vaults } from 'helpers'


type Vaults = {
  address: string
  protocol: string
  tokenSymbol: string
  apr: number
}[]

type State = {
  vaults: Vaults
  selectedVaultIds: string[]
  percentageDistribution: number[]
}

const Context = React.createContext<[ State, SetState<State> ]>(null)

export const useContext = () => React.useContext(Context)

export const ContextProvider = ({ children }) => {
  const context = useReducerState<State>({
    vaults,
    selectedVaultIds: null,
    percentageDistribution: null,
  })

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  )
}
