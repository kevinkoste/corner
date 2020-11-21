import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import styles from './browse.module.css'

import { api } from '../../libs/api'
import {
  useAppContext,
  setAuth,
  setOnboarded,
  setUserId,
  setEmail,
  setUsername,
} from '../../context/AppContext'

import { Page } from '../../components/Base'
import Header from '../../components/Header'

function BrowsePage({ profiles }) {
  return (
    <Page>
      <Head>
        <title>Corner - Browse</title>
        <meta
          name="description"
          content="Corner - an internet profile builder"
        />
      </Head>

      <main className={styles.main}>
        <Header title="Browse" />

        <div className={styles.body}>
          {profiles
            .filter((profile) => Object.keys(profile).length !== 0)
            .map((profile, index) => (
              <ProfileRow key={index} profile={profile} />
            ))}
        </div>
      </main>
    </Page>
  )
}

export default BrowsePage

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api({
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
  const router = useRouter()

  const name = profile.components.find((comp) => comp.type === 'name')?.props
    ?.name
  const image = profile.components.find((comp) => comp.type === 'headshot')
    ?.props?.image
  const headline = profile.components.find((comp) => comp.type === 'headline')
    ?.props?.headline

  const onClick = () => {
    router.push(`/${profile.username}`)
  }

  return (
    <div className={styles.rowContainer} onClick={onClick}>
      <img
        className={styles.rowImage}
        src={process.env.NEXT_PUBLIC_S3_BUCKET + 'small/' + image}
      />
      <div className={styles.rowTextContainer}>
        <p>
          <u>{name}</u>
          <br />"{headline}"
        </p>
      </div>
    </div>
  )
}
