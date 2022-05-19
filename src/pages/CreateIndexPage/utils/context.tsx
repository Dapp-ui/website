import React from 'react'
import { useReducerState } from 'hooks'
import type { SetState } from 'hooks'


type Vaults = {
  id: number
  protocol: string
  name: string
  apr: number
}[]

const vaults = [
  {
    id: 1,
    protocol: 'Yearn',
    name: 'yUSDT',
    apr: 23,
  },
  {
    id: 2,
    protocol: 'Yearn',
    name: 'yCRV3Pool',
    apr: 16,
  },
  {
    id: 3,
    protocol: 'Yearn',
    name: 'yUSDC',
    apr: 18,
  },
]

type State = {
  vaults: Vaults
  selectedVaultIds: number[]
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
