import type { AppProps } from 'next/app'
import './_app.css'

import { AppProvider } from '../context/AppContext'
import { SWRConfig } from 'swr'
import { fetcher } from '../libs/api'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <SWRConfig value={{ fetcher: fetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </AppProvider>
  )
}
