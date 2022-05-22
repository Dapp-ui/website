import type { NextPage } from 'next'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { getFactoryContract, rpcProvider, initialBlocks } from 'contracts'
import { fetchIndexData, makeBlockRanges, formatStringNumber } from 'helpers'
import { useVaults } from 'contexts'
import { useQuery } from 'hooks'

import { WidthContainer } from 'components/layout'
import { Text, Table } from 'components/dataDisplay'
import type { TableColumns } from 'components/dataDisplay'
import { Bone } from 'components/feedback'
import { Button } from 'components/inputs'

import s from './IndexesPage.module.scss'


const hiddenIndexes = [
  '0x4Af994BA04Fe0Bf9d446247Fe2e8c0992e3d6080',
  '0x1135CF05E19CF8444CE4579D8dd58c7f9429139b',
  '0x9390E78794b03d8B6f5Ccf5eD75529A5F665c0C6',
  '0x1f48BfE4430C15D40f8EE15931502DC3f2086807',
  '0x78F12068a69cA30a5112c7C320428e7B15054677',
  '0x990Bad9850D1fDdb22B896800D45eF6a003C77bD',
]

type RowData = {
  address: string
  name: string
  symbol: string
  components: {
    protocol: string
    vault: string
    tokenSymbol: string
    targetWeight: string
  }[]
  totalAPY: number
  totalPrice: string
}

const IndexesPage: NextPage = () => {
  const router = useRouter()
  const { isVaultsFetching, vaultsMap } = useVaults()

  const getAddresses = async () => {
    const cacheKey = 'index-club-indexes-cache'
    let storageValue = localStorage.getItem(cacheKey)

    if (storageValue) {
      const { createdAt, data } = JSON.parse(storageValue)

      // less than 10 min
      if (Date.now() - createdAt < 10 * 60 * 60 * 1000) {
        return data
      }
    }

    const factoryContract = getFactoryContract()
    const filter = factoryContract.filters.IndexCreated()

    const lastBlock = await rpcProvider.getBlockNumber()
    const blockRanges = makeBlockRanges(initialBlocks.factory, lastBlock)

    const events = await Promise.all(
      blockRanges.map(([ startBlock, endBlock ]) => (
        factoryContract.queryFilter(filter, startBlock, endBlock)
      ))
    )

    const addresses = events.flat().map(({ args: { index: indexAddress } }) => indexAddress)

    localStorage.setItem(cacheKey, JSON.stringify({ createdAt: Date.now(), data: addresses }))

    return addresses
  }

  const fetcher = async () => {
    const addresses = await getAddresses()

    const items = await Promise.all(addresses.map(async (indexAddress) => {
      return fetchIndexData(indexAddress, vaultsMap)
    }))

    return items.filter(Boolean).filter((index) => !hiddenIndexes.includes(index.address))
  }

  let { isFetching, data } = useQuery({
    endpoint: 'indexes',
    fetcher,
    skip: isVaultsFetching,
  })

  isFetching = isFetching || isVaultsFetching

  if (isFetching) {
    data = [ {}, {}, {} ] as any
  }

  const columns = useMemo(() => {
    const columns: TableColumns<RowData> = [
      {
        id: 'name',
        Header: 'Name',
        accessor: ({ symbol, name }) => {
          if (isFetching) {
            return <Bone w={210} h={16} />
          }

          return (
            <>
              <b>{symbol}</b> / <span>{name}</span>
            </>
          )
        },
      },
      {
        id: 'components',
        Header: 'Tokens',
        accessor: ({ components }) => {
          if (isFetching) {
            return <Bone w={397} h={16} />
          }

          return (
            <div className="flex">
              {
                components.map(({ tokenSymbol }) => (
                  <div key={tokenSymbol} className={s.tag}>{tokenSymbol}</div>
                ))
              }
            </div>
          )
        },
      },
      {
        id: 'apy',
        Header: 'APY',
        accessor: ({ totalAPY }) => {
          if (isFetching) {
            return <Bone w={40} h={16} />
          }

          return totalAPY ? <b>{totalAPY}%</b> : 'N/A'
        },
      },
      {
        id: 'totalPrice',
        Header: 'TVL',
        accessor: ({ totalPrice }) => {
          if (isFetching) {
            return <Bone w={107} h={16} />
          }

          return `$${formatStringNumber(totalPrice)}`
        },
      },
      {
        id: 'action',
        Header: '',
        accessor: () => {
          if (isFetching) {
            return <Bone w={68} h={16} />
          }

          return (
            <Button
              size={32}
              style="primary"
            >
              Deposit
            </Button>
          )
        },
      },
    ]

    return columns
  }, [ isFetching ])

  const handleRowClick = (row) => {
    if (!isFetching) {
      router.push(`/indexes/${row.original.address}`)
    }
  }

  return (
    <WidthContainer>
      <Text className="mb-56" style="h3" color="gray-40">Most Profitable Indexes</Text>
      <Table
        className={s.table}
        columns={columns}
        data={data}
        onRowClick={handleRowClick}
      />
    </WidthContainer>
  )
}

export default IndexesPage
