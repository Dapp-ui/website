import { Yearn } from '@yfi/sdk'
import { JsonRpcProvider } from '@ethersproject/providers'
import { RPC_PROVIDER } from 'contracts'


const chainId = 250
const provider = new JsonRpcProvider(RPC_PROVIDER)

const yearnSdk = new Yearn(chainId, {
  provider,
  // subgraph: {
  //   fantomSubgraphEndpoint: 'https://gateway.thegraph.com/api/9ea1971aa5ed1d63427466d18b247887/subgraphs/id/QmQ9B5nGRCWhPp1ngMY4oBW8sTSxtHXAsiPvFDFnsHKbTa',
  // },
})

export default yearnSdk
