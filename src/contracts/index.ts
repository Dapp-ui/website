import { Contract } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'

import USDTABI from './abis/USDT.json'
import FactoryABI from './abis/Factory.json'
import IndexMasterABI from './abis/IndexMaster.json'
import type { USDT } from './types/USDT'
import type { Factory } from './types/Factory'
import type { IndexMaster } from './types/IndexMaster'


export const RPC_PROVIDER = 'https://rpc.ankr.com/fantom'

export const addresses = {
  token: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
  factory: '0x3786a1046c0B7581B64E28331997Dc2d279324E2', // WFTM: 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83
}

export const decimals = {
  token: 6,
  chainLink: 8,
}

export const initialBlocks = {
  factory: 38652376,
}

export const rpcProvider = new JsonRpcProvider(RPC_PROVIDER)

export const getTokenContract = (provider = rpcProvider) => {
  return new Contract(addresses.token, USDTABI, provider) as unknown as USDT
}

export const getVaultContract = (address, provider = rpcProvider) => {
  return new Contract(address, USDTABI, provider) as unknown as USDT
}

export const getFactoryContract = (provider = rpcProvider) => {
  return new Contract(addresses.factory, FactoryABI, provider) as unknown as Factory
}

export const getIndexContract = (address, provider = rpcProvider) => {
  return new Contract(address, IndexMasterABI, provider) as unknown as IndexMaster
}
