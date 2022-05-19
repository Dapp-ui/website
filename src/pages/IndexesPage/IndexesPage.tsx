import type { NextPage } from 'next'

import { Container, Card, CardContent } from '@mui/material'

import s from './IndexesPage.module.scss'


const items = [ 1, 2, 3, 4 ]

const IndexesPage: NextPage = () => {

  return (
    <Container>
      <div className={s.items}>
        {
          items.map((item) => (
            <Card key={item}>
              <CardContent>
                {item}
              </CardContent>
            </Card>
          ))
        }
      </div>
    </Container>
  )
}

export default IndexesPage
