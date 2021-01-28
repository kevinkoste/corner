import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from './Base.module.css'

import { useAppContext, setAuth } from '../context/appContext'
import { api } from '../libs/api'

import BeatLoader from 'react-spinners/BeatLoader'

export const Page = ({ children, ...props }) => {
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

export function Header({ title }) {
  const router = useRouter()
  const { state, dispatch } = useAppContext()
  const [showingBurger, setShowingBurger] = useState(false)

  const toggleBurger = () => setShowingBurger(!showingBurger)

  const takeHome = async () => {
    if (state.auth) {
      await router.push('/app/browse')
    } else {
      await router.push('/')
    }
    if (showingBurger) {
      setShowingBurger(false)
    }
  }

  const handleLogOut = async () => {
    try {
      await api({
        method: 'post',
        url: `/auth/logout`,
      })
    } catch (err) {
      console.log('error while logging out: ', err)
    }
    dispatch(setAuth(false))
    await router.push('/')
    toggleBurger()
  }

  if (!showingBurger) {
    return (
      <header className={styles.headerWrapper}>
        <div className={styles.headerContainer}>
          <TypewriterText
            first="Corner"
            second={title}
            delay={3913}
            disabled={false}
          />
          <img
            className={styles.burgerButton}
            onClick={toggleBurger}
            src="/icons/gray-burger.svg"
            alt="burger button"
          />
        </div>
      </header>
    )
  }

  return (
    <div className={styles.menuContainer}>
      <header
        className={styles.headerWrapper}
        style={{ backgroundColor: '#333333' }}
      >
        <div
          className={styles.headerContainer}
          style={{ borderColor: '#ffffff' }}
        >
          <h1 style={{ color: 'white', cursor: 'pointer' }} onClick={takeHome}>
            Corner
          </h1>
          <img
            className={styles.exitButton}
            onClick={toggleBurger}
            src="/icons/exit.png"
            alt="exit burger button"
          />
        </div>
      </header>

      <div className={styles.menuBody}>
        <h1
          onClick={async () => {
            await router.push(`/app/browse`)
            toggleBurger()
          }}
          style={{ cursor: 'pointer' }}
        >
          Browse Profiles
        </h1>

        {!state.auth && (
          <h1
            onClick={async () => {
              await router.push(`/app/login`)
              toggleBurger()
            }}
            style={{ cursor: 'pointer' }}
          >
            Join or Log In
          </h1>
        )}

        {state.auth && !state.onboarded && (
          <h1
            onClick={async () => {
              await router.push(`/app/onboarding`)
              toggleBurger()
            }}
            style={{ cursor: 'pointer' }}
          >
            Make Your Profile
          </h1>
        )}

        {state.auth && state.onboarded && (
          <h1
            onClick={async () => {
              await router.push(`/app/edit/${state.username}`)
              toggleBurger()
            }}
            style={{ cursor: 'pointer' }}
          >
            My Profile
          </h1>
        )}

        {state.auth && <h1 onClick={handleLogOut}>Log Out</h1>}
      </div>
    </div>
  )
}

function TypewriterText({ first, second, delay, disabled }) {
  const [text, setText] = useState(first)

  useEffect(() => {
    let mounted = true
    setTimeout(() => {
      if (mounted) setText(second)
    }, delay)
    return () => (mounted = false)
  }, [])

  return <h1 className={disabled ? '' : styles.typewriter}>{text}</h1>
}
