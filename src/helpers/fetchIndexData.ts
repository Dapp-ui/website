import { formatUnits } from '@ethersproject/units'
import { getIndexContract, getVaultContract, decimals } from 'contracts'
import type { VaultsContextState } from 'contexts'


const fetchIndexData = async (address: string, vaultsMap: VaultsContextState['vaultsMap']) => {
  const indexContract = getIndexContract(address)

  const [
    owner,
    name,
    symbol,
    { prices: rawPrices, totalPrice: rawTotalPrice },
    rawTotalSupply,
    indexDecimals,
  ] = await Promise.all([
    indexContract.owner(),
    indexContract.name(),
    indexContract.symbol(),
    indexContract.getComponentPrices(),
    indexContract.totalSupply(),
    indexContract.decimals(),
  ])

  let index = 0
  let prevResult
  const components = []
  const totalPrice = formatUnits(rawTotalPrice, decimals.chainLink)
  const totalSupply = formatUnits(rawTotalSupply, indexDecimals)

  while (!index || prevResult) {
    try {
      console.log(`Start fetching indexContract.components(${index})`)

      prevResult = await indexContract.components(index++)

      const { vault: vaultAddress, targetWeight: rawTargetWeight } = prevResult
      const { protocol } = vaultsMap[vaultAddress]

      const vaultContract = getVaultContract(vaultAddress)
      const tokenSymbol = await vaultContract.name()

      components.push({
        protocol,
        vault: vaultAddress,
        targetWeight: rawTargetWeight.toNumber(),
        tokenSymbol,
      })
    }
    catch (err) {
      // console.error(err)
      console.log(`Failed to fetch indexContract.components(${index - 1})`)
      prevResult = null
    }
  }

  return {
    owner,
    address,
    name,
    symbol,
    components,
    totalPrice,
    totalSupply,
  }
}

export default fetchIndexData
