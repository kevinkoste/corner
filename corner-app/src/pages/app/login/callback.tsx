import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { api } from '../../../libs/api'
import { Magic } from 'magic-sdk'
import {
  useAppContext,
  setAuth,
  setOnboarded,
  setUserId,
  setEmail,
  setUsername,
} from '../../../context/appContext'

import { Page, Main, Body, Loader } from '../../../components/Base'

function LoginPage() {
  const router = useRouter()

  const { state, dispatch } = useAppContext()

  useEffect(() => {
    onMount()
  }, [])

  const onMount = async () => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
    magic.preload()
    if (state.auth) {
      await router.push('/app/browse')
    }

    try {
      const didToken = await magic.auth.loginWithCredential()
      console.log('got didToken in redirect: ', didToken)

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
        <Body>
          <Loader />
        </Body>
      </Main>
    </Page>
  )
}

export default LoginPage
