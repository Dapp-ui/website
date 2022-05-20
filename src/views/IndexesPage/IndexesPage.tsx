import type { NextPage } from 'next'
import Link from 'next/link'
import { getFactoryContract, rpcProvider, initialBlocks } from 'contracts'
import { getVault, fetchIndexData, makeBlockRanges } from 'helpers'
import { useQuery } from 'hooks'

import { Container, Card, CardContent } from '@mui/material'

import s from './IndexesPage.module.scss'


const IndexesPage: NextPage = () => {

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
      return fetchIndexData(indexAddress)
    }))

    return items.filter(Boolean)
  }

  const { isFetching, data } = useQuery({
    endpoint: 'indexes',
    fetcher,
  })

  return (
    <Container>
      {
        isFetching ? (
          <div>Loading...</div>
        ) : (
          <div className={s.items}>
            {
              data.map(({ address, name, symbol, components }) => (
                <Link key={address} href={`/indexes/${address}`}>
                  <a>
                    <Card>
                      <CardContent>
                        <div>Name: <b>{name}</b></div>
                        <div>Symbol: <b>{symbol}</b></div>
                        <div className="mt-20">
                          {
                            components.map(({ vault: address, targetWeight }) => {
                              const { protocol, tokenSymbol } = getVault(address)

                              return (
                                <div key={address}>
                                  Protocol: <b>{protocol}</b>, Token: <b>{tokenSymbol}</b>, <b>{targetWeight}%</b>
                                </div>
                              )
                            })
                          }
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))
            }
          </div>
        )
      }
    </Container>
  )
}

export default IndexesPage
