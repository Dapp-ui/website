import type { NextPage } from 'next'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { getFactoryContract, rpcProvider, initialBlocks } from 'contracts'
import { fetchIndexData, makeBlockRanges } from 'helpers'
import { useVaults } from 'contexts'
import { useQuery } from 'hooks'

import { WidthContainer } from 'components/layout'
import { Text, Table } from 'components/dataDisplay'
import type { TableColumns } from 'components/dataDisplay'
import { Bone } from 'components/feedback'
import { Button } from 'components/inputs'

import s from './IndexesPage.module.scss'


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
  apy: number
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

    return items.filter(Boolean)
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
        accessor: ({ apy }) => {
          if (isFetching) {
            return <Bone w={40} h={16} />
          }

          return apy ? <b>${apy}%</b> : 'N/A'
        },
      },
      {
        id: 'totalPrice',
        Header: 'TVL',
        accessor: ({ totalPrice }) => {
          if (isFetching) {
            return <Bone w={107} h={16} />
          }

          return `$${totalPrice}`
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
              size={28}
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
