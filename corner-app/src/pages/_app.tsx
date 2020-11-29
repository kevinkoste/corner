import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import './_app.css'

import { AppProvider } from '../context/AppContext'
import { ProfileProvider } from '../context/ProfileContext'

import { fetcher } from '../libs/api'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <ProfileProvider>
        <SWRConfig value={{ fetcher: fetcher }}>
          <Component {...pageProps} />
        </SWRConfig>
      </ProfileProvider>
    </AppProvider>
  )
}
