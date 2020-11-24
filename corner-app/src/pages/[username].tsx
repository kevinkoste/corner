import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'

import styles from './[username].module.css'
import Header from '../components/Header'
import { Page } from '../components/Base'

import { api } from '../libs/api'
import { useAppContext } from '../context/AppContext'
import { GenerateComponent } from '../factories/GenerateProfile'

function ProfilePage({ username, name, components }) {
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

      <main className={styles.main}>
        <Header title={name} />

        <div className={styles.body}>
          {components.map((comp) => GenerateComponent(comp, name))}
        </div>

        {!state.auth && (
          <Link href="/app/login">
            <button className={styles.floatingButton}>Join Corner</button>
          </Link>
        )}
      </main>
    </Page>
  )
}

export default ProfilePage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { username } = params

  const { data } = await api({
    method: 'get',
    url: `/public/profile`,
    params: {
      username: username,
    },
  })

  const { components } = data
  const name = components.find((comp) => comp.type === 'name')?.props.name

  return {
    props: {
      username: username,
      name: name,
      components: components,
    },
  }
}
