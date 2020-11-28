import Head from 'next/head'
import styles from './browse.module.css'

import { useState } from 'react'

import { Page, Body,  ActiveInput } from '../../components/Base'

function SandboxPage() {
  const [textInput, setTextInput] = useState('')

  const handleChange = (event: any) => {
    setTextInput(event.target.value)
  }

  return (
    <Page>
      <Head>
        <title>Corner - Sandbox</title>
        <meta
          name="description"
          content="Corner - an internet profile builder"
        />
      </Head>

      <main className={styles.main}>
        <Body>
          <ActiveInput
            value={textInput}
            label="Username"
            onChange={handleChange}
          />
        </div>
      </main>
    </Page>
  )
}

export default SandboxPage
