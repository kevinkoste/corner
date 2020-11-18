import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import styles from './index.module.css'
import { Page } from '../components/Base'
import Header from '../components/Header'

import { useAppContext } from '../context/AppContext'

const Home: React.FC = () => {
  const router = useRouter()
  const { state } = useAppContext()

  useEffect(() => {
    if (state.auth) {
      router.push('/browse')
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

      <main className={styles.main}>
        <Header title="Home" />

        <div className={styles.body}>
          <h1>Welcome to Your Corner of the Internet</h1>

          <h2>
            Corner is a platform to meet young people with big ideas. It’s part
            website builder, part professional network, and part portfolio site.
          </h2>

          <Link href="/">
            <a>Join Corner</a>
          </Link>
        </div>
      </main>
    </Page>
  )
}

export default Home
