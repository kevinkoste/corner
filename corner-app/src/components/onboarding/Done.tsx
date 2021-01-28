import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from './onboarding.module.css'

import { api } from '../../libs/api'
import { OnboardingProps } from '../../models/onboarding'
import {
  useAppContext,
  setOnboarded,
  setUsername,
} from '../../context/appContext'

export const Done: React.FC<OnboardingProps> = ({ onboardingData }) => {
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    const onMount = async () => {
      await api({
        method: 'post',
        url: `/protect/profile`,
        data: {
          username: onboardingData.username,
          name: onboardingData.name,
          components: [
            {
              id: uuidv4().toString(),
              type: 'headshot',
              props: {
                image: onboardingData.image,
              },
            },
            {
              id: uuidv4().toString(),
              type: 'headline',
              props: {
                headline: onboardingData.title,
              },
            },
          ],
        },
      })
      dispatch(setUsername(onboardingData.username))
      dispatch(setOnboarded(true))
    }
    onMount()
    // upload profile here
  }, [])

  return (
    <div className={styles.container}>
      <h1>That's it!</h1>
      <br />
    </div>
  )
}
