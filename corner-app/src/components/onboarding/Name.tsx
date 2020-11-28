import { useState, useEffect } from 'react'
import styles from './onboarding.module.css'

import { ActiveInput } from '../../components/Base'
import { OnboardingProps } from '../../models/onboarding'

export const Name: React.FC<OnboardingProps> = ({
  onboardingData,
  setOnboardingData,
  canContinue,
  setCanContinue,
  onForwardClick,
}) => {
  const [started, setStarted] = useState(false)
  const [valid, setValid] = useState(false)

  useEffect(() => {
    // if returning to component, populate input
    if (onboardingData.name !== '') {
      setValid(true)
      setCanContinue(true)
    } else {
      setStarted(false)
      setValid(false)
      setCanContinue(false)
    }
  }, [])

  const onChange = (event: any) => {
    setStarted(true)
    const filteredText = event.target.value.replace(/[^a-zA-Z0-9\s]/g, '')
    setOnboardingData({ ...onboardingData, name: filteredText })

    if (filteredText.split(' ').length > 1) {
      setValid(true)
      setCanContinue(true)
    } else {
      setValid(false)
      setCanContinue(false)
    }
  }

  // enter key advances form
  const onKeyDown = (event: any) => {
    if (event.key === 'Enter' && valid) {
      event.preventDefault()
      onForwardClick()
    }
  }

  return (
    <div className={styles.container}>
      <h1 style={{ marginBottom: '2rem' }}>Your Name</h1>

      <div className={styles.formRow}>
        <ActiveInput
          className={styles.activeInput}
          style={{ textTransform: 'capitalize' }}
          label="Name"
          value={onboardingData.name}
          onChange={onChange}
          onKeyDown={onKeyDown}
          spellCheck="false"
          autoFocus
        />
        {canContinue && (
          <img
            className={styles.checkmark}
            src="/icons/green-checkmark.svg"
            alt="green checkmark"
          />
        )}
      </div>

      {started && !valid && (
        <p className={styles.errorText}>
          Please enter your first and last name
        </p>
      )}
    </div>
  )
}
