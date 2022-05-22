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


const hiddenIndexes = [ '0x4Af994BA04Fe0Bf9d446247Fe2e8c0992e3d6080' ]

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

  const fetcher = async () => {
    const factoryContract = getFactoryContract()
    const filter = factoryContract.filters.IndexCreated()

    const lastBlock = await rpcProvider.getBlockNumber()
    const blockRanges = makeBlockRanges(initialBlocks.factory, lastBlock)

    const events = await Promise.all(
      blockRanges.map(([ startBlock, endBlock ]) => (
        factoryContract.queryFilter(filter, startBlock, endBlock)
      ))
    )

    const items = await Promise.all(events.flat().map(async ({ args: { index: indexAddress } }) => {
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
      <Text className="mb-56" style="h3">
        Most Profitable Indexes
      </Text>
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
