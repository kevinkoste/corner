import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import styles from './index.module.css'
import { Page, Main, Body } from '../components/Base'
import Header from '../components/Header'

import { useAppContext } from '../context/appContext'

export default function Home() {
  const router = useRouter()
  const { state } = useAppContext()

  useEffect(() => {
    if (state.auth) {
      router.push('/app/browse')
    }
  }, [])

  return (
    <Page>
      <Head>
        <title>Corner</title>
        <meta
          name="description"
          content="Corner - an internet profile builder"
        />
      </Head>

      <Main>
        <Header title="Home" />

        <Body style={{ padding: '1rem' }}>
          <h1 className={styles.title}>Build your internet presence</h1>

          <p className={styles.subtitle}>
            Stop worrying about finding 500 people to "connect" with. Your
            Corner profile looks professional from the moment you build it.
          </p>

          <p className={styles.subtitle}>
            It takes 60 seconds, and it's perfect for your link-in-bio.
          </p>

          <Link href="/app/login">
            <button className={styles.linkButton}>Join Corner</button>
          </Link>
        </Body>
      </Main>
    </Page>
  )
}
