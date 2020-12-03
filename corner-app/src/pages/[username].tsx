import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'

import styles from './[username].module.css'
import Header from '../components/Header'
import { Page, Main, Body } from '../components/Base'

import { api } from '../libs/api'
import { useAppContext } from '../context/appContext'
import { GenerateComponent } from '../factories/generateProfile'

export default function ProfilePage({ username, name, components }) {
  const router = useRouter()
  const { state } = useAppContext()

  useEffect(() => {
    if (state.username === username) {
      router.push(`app/edit/${username}`)
    }
  }, [])

  return (
    <Page>
      <Head>
        <title>{name}'s Corner profile</title>
        <meta
          name="description"
          content="Corner - an internet profile builder"
        />
      </Head>

      <Main>
        <Header title={name} />

        <Body style={{ paddingTop: '60px', paddingBottom: '80px' }}>
          {components.map((comp) => GenerateComponent(comp, name))}
        </Body>

        {!state.auth && (
          <Link href="/app/login">
            <button className={styles.floatingButton}>Join Corner</button>
          </Link>
        )}
      </Main>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { username } = params

  const { data } = await api({
    method: 'get',
    url: `/public/profile`,
    params: {
      username: username,
    },
  })

  const { components, name } = data

  return {
    props: {
      username: username,
      name: name !== '' ? name : username,
      components: components,
    },
  }
}
