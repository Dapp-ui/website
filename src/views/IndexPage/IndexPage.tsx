import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useQuery } from 'hooks'
import Link from 'next/link'
import { Container, Button } from '@mui/material'
import { getIndexContract } from 'contracts'
import { fetchIndexData, getVault } from 'helpers'
import { useConnectWallet } from '@web3-onboard/react'

import Position from './components/Position/Position'

import s from './IndexPage.module.scss'


const useFetchData = (address: string) => {
  const cacheKey = `app-cache--index-${address}`
  const storageData = localStorage.getItem(cacheKey)

  const fetcher = () => {
    return fetchIndexData(address)
  }

  let { isFetching, data } = useQuery({
    endpoint: [ 'index', address ],
    fetcher,
    skip: Boolean(storageData),
  })

  data = storageData ? JSON.parse(storageData) : data

  useEffect(() => {
    if (!isFetching && data) {
      localStorage.setItem(cacheKey, JSON.stringify(data))
    }
  }, [ isFetching, data ])

  return {
    isFetching,
    data,
  }
}

type IndexPageProps = {
  address: string
}

const IndexPage: NextPage<IndexPageProps> = ({ address }) => {
  const [ { wallet } ] = useConnectWallet()
  const { isFetching, data } = useFetchData(address)

  const { owner, name, symbol, components } = data || {}

  const isOwner = wallet?.accounts?.[0].address.toLowerCase() === owner?.toLowerCase()

  return (
    <Container>
      {
        isFetching ? (
          <div>Loading...</div>
        ) : (
          <div className={s.content}>
            <div>
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
              {
                isOwner && (
                  <Link href={`/indexes/${address}/edit`}>
                    <a>
                      <Button size="medium" variant="contained">Edit Index</Button>
                    </a>
                  </Link>
                )
              }
            </div>
            <div>
              <Position indexAddress={address} />
            </div>
          </div>
        )
      }
    </Container>
  )
}

IndexPage.getInitialProps = ({ query }) => {

  return {
    address: query.address as string,
  }
}

export default IndexPage
