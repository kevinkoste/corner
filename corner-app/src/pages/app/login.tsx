import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from './login.module.css'

import { api } from '../../libs/api'
import { Magic } from 'magic-sdk'
import {
  useAppContext,
  setAuth,
  setOnboarded,
  setUserId,
  setEmail,
  setUsername,
} from '../../context/AppContext'

import { Page, Main, Body, Loader, ActiveInput } from '../../components/Base'
import Header from '../../components/Header'

function LoginPage() {
  const router = useRouter()

  const { state, dispatch } = useAppContext()

  const [loading, setLoading] = useState<boolean>(false)
  const [emailInput, setEmailInput] = useState<string>('')

  useEffect(() => {
    if (state.auth) {
      router.push('/app/browse')
    }
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
      const didToken = await magic.auth.loginWithMagicLink({
        email: emailInput,
      })
      if (!didToken) {
        throw Error('Magic API error')
      }

      const { data } = await api({
        method: 'post',
        url: `/auth/login`,
        headers: { authorization: `Bearer ${didToken}` },
      })
      const { userId, email, onboarded, username } = data

      dispatch(setAuth(true))
      setLoading(false)

      if (onboarded) {
        dispatch(setUserId(userId))
        dispatch(setEmail(email))
        dispatch(setUsername(username))
        dispatch(setOnboarded(true))
        router.push(`/app/edit/${username}`)
      } else {
        router.push('/app/onboarding')
      }
    } catch (err) {
      setLoading(false)
      console.log('login error:', err)
      router.push('/')
    }
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
