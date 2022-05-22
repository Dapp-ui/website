import type { NextPage } from 'next'

import { WidthContainer } from 'components/layout'
import { Button } from 'components/inputs'

import s from './HomePage.module.scss'


const HomePage: NextPage = () => {

  return (
    <WidthContainer>
      <div className={s.content}>
        <div className={s.item}>
          <div className={s.title}>Create a Narrative that others can invest</div>
          <div className={s.info}>
            <p>Construct a strategy of yield opportunities across different vaults, pools, farms across popular chains.</p>
            <p>Tune an automated rebalance strategy based on APY, TVL, MCAP of underlying instruments.</p>
          </div>
          <Button
            size={44}
            style="primary"
            to="/create"
          >
            Cteate Index
          </Button>
        </div>
        <div className={s.item}>
          <div className={s.title}>Invest in narratives, not instruments</div>
          <div className={s.info}>
            <p>Invest in automated strategies diversified across different protocols and chains</p>
            <p>1 token to represent the whole strategy.</p>
          </div>
          <Button
            size={44}
            style="primary"
            to="/indexes"
          >
            Explore
          </Button>
        </div>
      </div>
    </WidthContainer>
  )
}

export default HomePage
