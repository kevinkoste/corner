import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from './index.module.css'

import { api } from '../../../libs/api'
import { Magic } from 'magic-sdk'
import {
  useAppContext,
  setAuth,
  setOnboarded,
  setUserId,
  setEmail,
  setUsername,
} from '../../../context/AppContext'

import { Page, Main, Body, Loader, ActiveInput } from '../../../components/Base'
import Header from '../../../components/Header'

function LoginPage() {
  const router = useRouter()

  const { state, dispatch } = useAppContext()

  const [loading, setLoading] = useState(false)
  const [emailInput, setEmailInput] = useState('')

  useEffect(() => {
    onMount()
  }, [])

  const onMount = async () => {
    if (state.auth) {
      await router.push('/app/browse')
    }
  }

  const handleLogin = async () => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
    setLoading(true)
    try {
      const didToken = await magic.auth.loginWithMagicLink({
        email: emailInput,
        redirectURI: `${window.location.origin}/app/login/callback`,
      })

      const { data } = await api({
        method: 'post',
        url: `/auth/login`,
        headers: { authorization: `Bearer ${didToken}` },
      })
      const { userId, email, onboarded, username } = data

      dispatch(setAuth(true))
      dispatch(setUserId(userId))
      dispatch(setEmail(email))

      if (onboarded) {
        dispatch(setUsername(username))
        dispatch(setOnboarded(true))
        await router.push(`/app/edit/${username}`)
      } else {
        await router.push('/app/onboarding')
      }
    } catch (err) {
      console.log('login error:', err)
      await router.push('/')
    }
    setLoading(false)
  }

  // enter key advances form
  const onKeyDown = (event: any) => {
    if (event.key === 'Enter' && emailInput !== '') {
      event.preventDefault()
      handleLogin()
    }
  }

  return (
    <Page>
      <Head>
        <title>Corner - Log In</title>
        <meta
          name="description"
          content="Corner - an internet profile builder"
        />
      </Head>

      <Main>
        <Header title="Login" />

        <Body style={{ padding: '1rem', alignItems: 'center' }}>
          {loading && <Loader />}
          {!loading && (
            <div className={styles.formContainer}>
              <ActiveInput
                className={styles.emailInput}
                label="Email"
                type="email"
                value={emailInput}
                onChange={(event: any) => setEmailInput(event.target.value)}
                onKeyDown={onKeyDown}
                spellCheck="false"
                autoCapitalize="none"
                autoFocus
              />
              <button className={styles.submitButton} onClick={handleLogin}>
                Log In or Sign Up
              </button>
            </div>
          )}
        </Body>
      </Main>
    </Page>
  )
}

export default LoginPage
