import type { AppProps } from 'next/app'
import { useEffect, useReducer, useState } from 'react'
import './_app.css'

import { api } from '../libs/api'
import { Loader } from '../components/Base'
import { ProfileProvider } from '../context/profileContext'
import {
  initialState,
  AppContext,
  AppReducer,
  setAuth,
  setOnboarded,
  setUserId,
  setEmail,
  setUsername,
} from '../context/AppContext'

export default function App({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(AppReducer, initialState)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const onMount = async () => {
      const { data } = await api({
        method: 'post',
        url: `/auth/check`,
      })

      const { auth, userId, email, onboarded, username } = data

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
      setLoading(false)
    }
    onMount()
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <ProfileProvider>
        {loading ? <Loader /> : <Component {...pageProps} />}
      </ProfileProvider>
    </AppContext.Provider>
  )
}
