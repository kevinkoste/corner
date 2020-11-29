import styles from './Base.module.css'

import { useEffect, useState } from 'react'

import BeatLoader from 'react-spinners/BeatLoader'
import { api } from '../libs/api'
import {
  useAppContext,
  setAuth,
  setOnboarded,
  setUserId,
  setEmail,
  setUsername,
} from '../context/AppContext'

export const Page = ({ children, ...props }) => {
  const { dispatch } = useAppContext()

  useEffect(() => {
    const onMount = async () => {
      const { data } = await api({
        method: 'post',
        url: `/auth/check`,
      })

      const { auth, userId, email, onboarded, username } = data
      console.log('response from /auth/check:', data)

      if (!auth) {
        dispatch(setAuth(false))
      } else {
        dispatch(setAuth(true))
        dispatch(setUserId(userId))
        dispatch(setEmail(email))

        if (onboarded) {
          dispatch(setOnboarded(true))
          dispatch(setUsername(username))
        }
      }
    }
    onMount()
  }, [])

  return (
    <div className={styles.page} {...props}>
      {children}
    </div>
  )
}

export const Main = ({ children, ...props }) => {
  return (
    <main className={styles.main} {...props}>
      {children}
    </main>
  )
}

export const Body = ({ children, ...props }) => {
  return (
    <div className={styles.body} {...props}>
      {children}
    </div>
  )
}

export const Loader = ({ ...props }) => {
  return (
    <div className={styles.loader} {...props}>
      <BeatLoader loading={true} color={'#333333'} />
    </div>
  )
}

export const ActiveInput = ({ value, label, ...props }) => {
  const [activated, setActivated] = useState(false)

  const handleFocus = () => {
    if ('onFocus' in props) {
      props.onFocus()
    }
    if (!activated) {
      setActivated(true)
    }
  }

  const handleBlur = () => {
    if ('onBlur' in props) {
      props.onBlur()
    }
    if (value == '') {
      setActivated(false)
    }
  }

  return (
    <div className={styles.activeInputWrapper}>
      <div className={styles.activeInput}>
        {'prefix' in props ? <p>{props.prefix}</p> : null}
        <input
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </div>
      <p
        className={
          activated ? styles.activeInputLabelOn : styles.activeInputLabelOff
        }
      >
        {label}
      </p>
    </div>
  )
}
