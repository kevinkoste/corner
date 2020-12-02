import { useState, useEffect } from 'react'
import styles from './onboarding.module.css'

import { ActiveInput } from '../../components/Base'
import { api } from '../../libs/api'
import { OnboardingProps } from '../../models/onboarding'

export const Username: React.FC<OnboardingProps> = ({
  onboardingData,
  setOnboardingData,
  canContinue,
  setCanContinue,
  onForwardClick,
}) => {
  const [started, setStarted] = useState(false)
  const [valid, setValid] = useState(false)
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    // if returning to component, populate input
    if (onboardingData.username !== '') {
      setValid(true)
      setCanContinue(true)
    }
  }, [])

  // checks availability on a timeout
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (onboardingData.username !== '') {
        const { data } = await api({
          method: 'get',
          url: `/public/availability`,
          params: {
            username: onboardingData.username,
          },
        })
        setAvailable(data)
        if (data === false) {
          setCanContinue(false)
        } else if (onboardingData.username === '') {
          setValid(false)
          setCanContinue(false)
        } else {
          setValid(true)
          setCanContinue(true)
        }
      }
    }, 200)
    return () => clearTimeout(delayDebounceFn)
  }, [onboardingData.username])

  const onChange = (event: any) => {
    setStarted(true)
    setAvailable(true)
    setCanContinue(false)
    const filteredText = event.target.value
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 15)

    if (filteredText === onboardingData.username) {
      setValid(true)
      setCanContinue(true)
    }
    setOnboardingData({ ...onboardingData, username: filteredText })
    if (filteredText !== '') {
      setValid(true)
    } else {
      setValid(false)
    }
  }

  // enter key advances form
  const onKeyDown = (event: any) => {
    if (event.key === 'Enter' && valid && available) {
      event.preventDefault()
      onForwardClick()
    }
  }

  return (
    <div className={styles.container}>
      <h1 style={{ marginBottom: '1.5rem' }}>Your unique link</h1>

      <div className={styles.formRow}>
        <ActiveInput
          prefix="corner.so/"
          label="Username"
          value={onboardingData.username}
          onChange={onChange}
          onKeyDown={onKeyDown}
          spellcheck="false"
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

      {!available && <p className={styles.errorText}>That username is taken</p>}
      {started && !valid && (
        <p className={styles.errorText}>Please enter a username</p>
      )}
    </div>
  )
}
