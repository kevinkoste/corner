import { useState, useEffect } from 'react'
import styles from './onboarding.module.css'

import TextareaAutosize from 'react-textarea-autosize'
import { OnboardingProps } from '../../models/onboarding'

export const Title: React.FC<OnboardingProps> = ({
  onboardingData,
  setOnboardingData,
  setCanContinue,
  onForwardClick,
}) => {
  const [started, setStarted] = useState(false)
  const [valid, setValid] = useState(false)

  useEffect(() => {
    // if returning to component, populate input
    if (onboardingData.title !== '') {
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
    const filteredText = event.target.value
    setOnboardingData({ ...onboardingData, title: filteredText })

    if (filteredText !== '') {
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
      <h1>Your One-liner</h1>
      <p style={{ marginBottom: '2rem' }}>No stress - change it anytime.</p>

      <TextareaAutosize
        className={styles.textareaAutosizeP}
        value={onboardingData.title}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoFocus
      />

      {started && !valid && (
        <p className={styles.errorText}>Please write a one-liner</p>
      )}
    </div>
  )
}
