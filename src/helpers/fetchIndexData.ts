import { formatUnits } from '@ethersproject/units'
import { getIndexContract, decimals } from 'contracts'
import type { VaultsContextState } from 'contexts'


const fetchIndexData = async (indexAddress: string, vaultsMap: VaultsContextState['vaultsMap']) => {
  const indexContract = getIndexContract(indexAddress)

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
      const { protocol, tokenName, apy } = vaultsMap[vaultAddress]

      components.push({
        protocol,
        vault: vaultAddress,
        targetWeight: rawTargetWeight.toNumber(),
        tokenName,
        apy,
      })
    }
    catch (err) {
      // console.error(err)
      console.log(`Failed to fetch indexContract.components(${index - 1})`)
      prevResult = null
    }
  }

  const totalWeight = components?.reduce((acc, { targetWeight }) => acc + targetWeight, 0)

  let totalAPY: any = components.reduce((acc, item) => {
    const { apy, targetWeight } = item
    return acc + apy * targetWeight / totalWeight
  }, 0)

  totalAPY = parseFloat(totalAPY).toFixed(2)

  return {
    owner,
    address: indexAddress,
    name,
    symbol,
    components,
    totalAPY,
    totalPrice,
    totalSupply,
  }
}

export default fetchIndexData
