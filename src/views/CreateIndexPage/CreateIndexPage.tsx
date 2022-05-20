import type { NextPage } from 'next'
import { useState } from 'react'
import { Container } from '@mui/material'

import { ContextProvider } from './utils/context'
import { Step1, Step2, Step3 } from './components'

import s from './CreateIndexPage.module.scss'


const CreateIndexPage: NextPage = () => {
  const [ step, setStep ] = useState(0)

  const handlePrevStep = () => {
    setStep((curr) => --curr)
  }

  const handleNextStep = () => {
    setStep((curr) => ++curr)
  }

  return (
    <ContextProvider>
      <Container>
        {
          step === 0 && (
            <Step1 onContinue={handleNextStep} />
          )
        }
        {
          step === 1 && (
            <Step2 onBack={handlePrevStep} onContinue={handleNextStep} />
          )
        }
        {
          step === 2 && (
            <Step3 onBack={handlePrevStep} />
          )
        }
      </Container>
    </ContextProvider>
  )
}

export default CreateIndexPage
