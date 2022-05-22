import React from 'react'
import { useReducerState } from 'hooks'
import type { SetState } from 'hooks'
import { useVaults } from 'contexts'
import type { VaultsContextState } from 'contexts'


type State = {
  selectedVaultIds: string[]
  shares: number[]
}

export type ContextState = VaultsContextState & State

const Context = React.createContext<[ ContextState, SetState<State> ]>(null)

export const useContext = () => React.useContext(Context)

export const ContextProvider = ({ children }) => {
  const { isVaultsFetching, vaultsMap, vaultAddresses } = useVaults()

  const [ state, setState ] = useReducerState<State>({
    selectedVaultIds: null,
    shares: null,
  })

  const contextState = {
    ...state,
    isVaultsFetching,
    vaultsMap,
    vaultAddresses,
  }

  return (
    <Context.Provider value={[ contextState, setState ]}>
      {children}
    </Context.Provider>
  )
}
