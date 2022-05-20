import type { NextPage } from 'next'
import Link from 'next/link'
import { getFactoryContract } from 'contracts'
import { getVault, fetchIndexData } from 'helpers'
import { useQuery } from 'hooks'

import { Container, Card, CardContent } from '@mui/material'

import s from './IndexesPage.module.scss'


const IndexesPage: NextPage = () => {

  const fetcher = async () => {
    const factoryContract = getFactoryContract()
    const filter = factoryContract.filters.IndexCreated()

    const events = await factoryContract.queryFilter(filter)

    const items = await Promise.all(events.map(async ({ args: { index: indexAddress } }) => {
      // TODO filter for now - added on 5/20/22 by pavelivanov
      if (indexAddress === '0xBD5ACa974305Ded788E5E76E7C4B667cE2E4aB1e') {
        return
      }

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
