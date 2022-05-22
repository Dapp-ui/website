import React from 'react'

import { Text } from 'components/dataDisplay'

import s from './TeamPage.module.scss'


const team = [
  { image: 'alex', name: 'Alex Nikolaev' },
  { image: 'pavel', name: 'Pavel Ivanov' },
  { image: 'egor', name: 'Egor Polyakov' },
]

const TeamPage: React.FC = () => {

  return (
    <div>
      <Text className="mb-56 text-center" style="h1" color="gray-40">Our Team</Text>
      <div className={s.items}>
        {
          team.map(({ image, name }) => (
            <div key={name} className={s.item}>
              <div className={s.image}>
                <img src={`/images/${image}.jpg`} alt="" />
              </div>
              <div className={s.name}>{name}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default TeamPage
