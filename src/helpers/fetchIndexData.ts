import { getIndexContract } from 'contracts'


const fetchIndexData = async (address: string) => {
  const indexContract = getIndexContract(address)

  const [ owner, name, symbol ] = await Promise.all([
    indexContract.owner(),
    indexContract.name(),
    indexContract.symbol(),
  ])

  let index = 0
  let prevResult
  const components = []

  while (!index || prevResult) {
    try {
      console.log(`Start fetching indexContract.components(${index})`)

      prevResult = await indexContract.components(index++)

      const { vault, targetWeight: rawTargetWeight } = prevResult

      components.push({
        vault,
        targetWeight: rawTargetWeight.toNumber(),
      })
    }
    catch (err) {
      console.log(`Failed to fetch indexContract.components(${index - 1})`)
      // console.error(err)
      prevResult = null
    }
  }

  return {
    owner,
    address,
    name,
    symbol,
    components,
  }
}

export default fetchIndexData
