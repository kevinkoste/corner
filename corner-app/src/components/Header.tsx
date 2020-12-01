import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { useAppContext, setAuth } from '../context/AppContext'
import { api } from '../libs/api'

import styles from './Header.module.css'

function Header({ title }) {
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
      <div className={styles.headerWrapper}>
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
      </div>
    )
  }
  return (
    <div className={styles.menuContainer}>
      <div
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
      </div>

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

        {!state.onboarded && !state.auth && (
          <h1
            onClick={async () => {
              await router.push(`/app/login`)
              toggleBurger()
            }}
            style={{ cursor: 'pointer' }}
          >
            Join Corner
          </h1>
        )}

        {!state.onboarded && state.auth && (
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

        {state.onboarded && state.auth && (
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

        {/* <InviteForm /> */}
      </div>
    </div>
  )
}

export default Header

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
