import type { NextPage } from 'next'
import { useQuery } from 'hooks'
import Link from 'next/link'
import { useVaults } from 'contexts'
import { fetchIndexData, colors } from 'helpers'
import { useConnectWallet } from '@web3-onboard/react'

import { WidthContainer } from 'components/layout'
import { Text } from 'components/dataDisplay'
import { Button } from 'components/inputs'

import Position from './components/Position/Position'

import s from './IndexPage.module.scss'


type IndexPageProps = {
  address: string
}

const IndexPage: NextPage<IndexPageProps> = ({ address }) => {
  const [ { wallet } ] = useConnectWallet()
  const { isVaultsFetching, vaultsMap } = useVaults()

  const fetcher = () => {
    return fetchIndexData(address, vaultsMap)
  }

  let { isFetching, data } = useQuery({
    endpoint: [ 'index', address ],
    fetcher,
    skip: !vaultsMap,
  })

  isFetching = isFetching || isVaultsFetching

  const { owner, name, symbol, components, totalPrice, totalSupply } = data || {}

  const isOwner = wallet?.accounts?.[0].address.toLowerCase() === owner?.toLowerCase()
  const totalWeight = components?.reduce((acc, { targetWeight }) => acc + targetWeight, 0)

  return (
    <WidthContainer>
      {
        isFetching ? (
          <div>Loading...</div>
        ) : (
          <div className={s.content}>
            <div>
              <Text style="h3" color="brand-70">{symbol} / {name}</Text>
              <div className="mt-40">
                <Text className="mb-24" style="h4">Tokens weight</Text>
                <div className={s.share}>
                  {
                    components.map(({ targetWeight }, index) => (
                      <div
                        key={index}
                        className={s.shareItem}
                        style={{ background: colors[index], width: `${targetWeight}%` }}
                      />
                    ))
                  }
                </div>
                <div className="mt-20">
                  {
                    components.map(({ protocol, vault: address, tokenSymbol, targetWeight }, index) => {
                      const share = parseFloat(Number(targetWeight / totalWeight * 100).toFixed(2))

                      return (
                        <div key={index} className={s.item}>
                          <div className={s.square} style={{ background: colors[index] }} />
                          <Text className={s.title} style="p1">{tokenSymbol}&nbsp;&nbsp;&nbsp;<span className="color-gray-20">{share}%</span></Text>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              {
                isOwner && (
                  <div className="mt-40">
                    <Text className="mb-24" style="h4">You are the owner of this Index</Text>
                    <Link href={`/indexes/${address}/edit`}>
                      <a className="block">
                        <Button
                          size={44}
                          style="primary"
                        >
                          Edit Index
                        </Button>
                      </a>
                    </Link>
                  </div>
                )
              }
            </div>
            <div>
              <Position
                indexAddress={address}
                indexSymbol={symbol}
                totalPrice={totalPrice}
                totalSupply={totalSupply}
              />
            </div>
          </div>
        )
      }
    </WidthContainer>
  )
}

IndexPage.getInitialProps = ({ query }) => {

  return {
    address: query.address as string,
  }
}

export default IndexPage
