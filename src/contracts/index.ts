import { Contract } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'

import FactoryABI from './abis/Factory.json'
import IndexMasterABI from './abis/IndexMaster.json'
import type { Factory } from './types/Factory'
import type { IndexMaster } from './types/IndexMaster'


export const RPC_PROVIDER = 'https://kovan.infura.io/v3/ea1f915397b044ae9020c8635149e105'

export const addresses = {
  factory: '0x2Bb4942a798966d9d8583E400310721E20798661',
}

const defaultProvider = new JsonRpcProvider(RPC_PROVIDER)

export const getFactoryContract = (provider = defaultProvider) => {
  return new Contract(addresses.factory, FactoryABI, provider) as unknown as Factory
}

export const getIndexContract = (address, provider = defaultProvider) => {
  return new Contract(address, IndexMasterABI, provider) as unknown as IndexMaster
}
