import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import styles from './index.module.css'
import { Page, Main, Body } from '../components/Base'
import Header from '../components/Header'

import { useAppContext } from '../context/AppContext'

const Home: React.FC = () => {
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
          <h1 className={styles.title}>
            Welcome to Your Corner of the Internet
          </h1>

          <p className={styles.subtitle}>
            Corner is a platform to meet young people with big ideas. It’s part
            website builder, part professional network, and part portfolio site.
          </p>

          <Link href="/app/login">
            <button className={styles.linkButton}>Join Corner</button>
          </Link>
        </Body>
      </Main>
    </Page>
  )
}

export default Home
