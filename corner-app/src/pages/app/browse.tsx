import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import styles from './browse.module.css'

import { apiSSR } from '../../libs/api'
import { Page, Header, Main } from '../../components/Base'

export default function BrowsePage({ profiles }) {
  return (
    <Page>
      <Head>
        <title>Corner - Browse</title>
        <meta
          name="description"
          content="Corner - an internet profile builder"
        />
      </Head>

      <Header title="Browse" />

      <Main style={{ padding: '51px 1rem' }}>
        {profiles
          .filter((profile) => Object.keys(profile).length !== 0)
          .map((profile, index) => (
            <ProfileRow key={index} profile={profile} />
          ))}
      </Main>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await apiSSR({
    method: 'get',
    url: `/public/profile/all`,
  })

  return {
    props: {
      profiles: data,
    },
  }
}

function ProfileRow({ profile }) {
  const name = profile.name

  const image = profile.components.find((comp) => comp.type === 'headshot')
    ?.props?.image
  const headline = profile.components.find((comp) => comp.type === 'headline')
    ?.props?.headline

  return (
    <Link href={`/${profile.username}`}>
      <div className={styles.rowContainer}>
        <img
          className={styles.rowImage}
          src={process.env.NEXT_PUBLIC_S3_BUCKET + 'small/' + image}
        />
        <div className={styles.rowTextContainer}>
          <p style={{ textDecoration: 'underline' }}>{name}</p>
          {headline && <p>{headline.substring(0, 90)}</p>}
        </div>
      </div>
    </Link>
  )
}
