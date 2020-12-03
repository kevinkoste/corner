import Head from 'next/head'
import styles from './browse.module.css'

import { useState } from 'react'
import { Page, Header, Main } from '../../components/Base'

import { Timeline } from 'react-twitter-widgets'

export default function SandboxPage() {
  return (
    <Page>
      <Head>
        <title>Corner - Sandbox</title>
        <meta
          name="description"
          content="Corner - an internet profile builder"
        />
      </Head>

      <Main>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: 'TwitterDev',
          }}
          options={{
            height: '400',
          }}
        />
      </Main>
    </Page>
  )
}
