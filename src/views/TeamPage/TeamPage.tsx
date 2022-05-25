import React from 'react'

import s from './TeamPage.module.scss'


const team = [
  { image: 'alex', name: 'Alex Nikolaev', role: 'Product', link: 'https://t.me/amijkko' },
  { image: 'pavel', name: 'Pavel Ivanov', role: 'Frontend, UI/UX', link: 'https://t.me/pavelorso' },
  { image: 'egor', name: 'Egor Polyakov', role: 'SmartContracts', link: 'https://t.me/poegva' },
]

const TeamPage: React.FC = () => {

  return (
    <div className={s.items}>
      {
        team.map(({ image, name, role, link }) => (
          <div key={name} className={s.item}>
            <div className={s.image}>
              <img src={`/images/${image}.jpg`} alt="" />
            </div>
            <div className={s.name}>{name}</div>
            <div className={s.role}>{role}</div>
            <a className={s.link} href={link} target="_blank" rel="noreferrer">get in touch</a>
          </div>
        ))
      }
    </div>
  )
}

export default TeamPage
