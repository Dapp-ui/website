import type { NextPage } from 'next'
import { useQuery } from 'hooks'
import Link from 'next/link'
import { useVaults } from 'contexts'
import { fetchIndexData } from 'helpers'
import { useConnectWallet } from '@web3-onboard/react'

import { WidthContainer } from 'components/layout'
import { Text } from 'components/dataDisplay'
import { Button } from 'components/inputs'

import Position from './components/Position/Position'

import s from './IndexPage.module.scss'


const colors = [
  '#22ff85',
  '#0be56c',
  '#06c65c',
  '#00af53',
  '#00863c',
]

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
              <div className="flex justify-between mb-40">
                <Text style="h3">{symbol} / {name}</Text>
                <Text style="h3">APR 20%</Text>
              </div>
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
                        <Text className={s.title} style="p1">{tokenSymbol} / {share}%</Text>
                      </div>
                    )
                  })
                }
              </div>
              {
                isOwner && (
                  <Link href={`/indexes/${address}/edit`}>
                    <a className="mt-40 block">
                      <Button
                        size={44}
                        style="primary"
                      >
                        Edit Index
                      </Button>
                    </a>
                  </Link>
                )
              }
            </div>
            <div>
              <Position
                indexAddress={address}
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
