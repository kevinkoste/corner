import Head from 'next/head'
import styles from './browse.module.css'

import { useState } from 'react'
import { Page, Main, Body } from '../../components/Base'

import { Timeline } from 'react-twitter-widgets'

function SandboxPage() {
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
        <Body>
          <Timeline
            dataSource={{
              sourceType: 'profile',
              screenName: 'TwitterDev',
            }}
            options={{
              height: '400',
            }}
          />
        </Body>
      </Main>
    </Page>
  )
}

export default SandboxPage
