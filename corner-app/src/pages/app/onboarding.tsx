import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from './onboarding.module.css'

import { Transition } from 'react-transition-group'

import Header from '../../components/Header'
import { Page, Main, Body } from '../../components/Base'
import { api } from '../../libs/api'

import { Username } from '../../components/onboarding/Username'
import { Name } from '../../components/onboarding/Name'
import { Title } from '../../components/onboarding/Title'
import { Image } from '../../components/onboarding/Image'
import { Done } from '../../components/onboarding/Done'

function OnboardingPage() {
  const router = useRouter()

  const [animate, setAnimate] = useState(false)
  const [activeItem, setActiveItem] = useState(1)
  const [canContinue, setCanContinue] = useState(false)

  const [onboardingData, setOnboardingData] = useState({
    username: '',
    name: '',
    title: '',
    image: '', // this will be the image identifier returned from the API
  })

  const duration = 300

  const items = [
    {
      id: 1,
      type: 'username',
      buttons: { forward: 'Add Name', backward: '' },
    },
    {
      id: 2,
      type: 'name',
      buttons: { forward: 'Add Headline', backward: 'Edit Username' },
    },
    {
      id: 3,
      type: 'headline',
      buttons: { forward: 'Add Headshot', backward: 'Edit Name' },
    },
    {
      id: 4,
      type: 'headshot',
      buttons: { forward: 'Generate Profile', backward: 'Edit Headline' },
    },
    {
      id: 5,
      type: 'done',
      buttons: { forward: 'Go to Your Profile', backward: '' },
    },
  ]

  useEffect(() => {
    const onMount = async () => {
      const { data } = await api({
        method: 'post',
        url: `/protect/invite/check`,
      })
      if (!data) {
        router.push('/not-invited')
      }
      // could also check to see if user has already onboarded and redirect
    }
    onMount()
  }, [])

  const onBackClick = () => {
    setAnimate(true)
    setTimeout(() => {
      setActiveItem(activeItem - 1)
      setAnimate(false)
    }, duration)
  }

  const onForwardClick = () => {
    if (activeItem === 5) {
      router.push(`/app/edit/${onboardingData.username}`)
      return
    }
    setAnimate(true)
    setTimeout(() => {
      setActiveItem(activeItem + 1)
      setAnimate(false)
    }, duration)
  }

  return (
    <Page>
      <Head>
        <title>Corner Onboarding</title>
        <meta
          name="description"
          content="Corner - an internet profile builder"
        />
      </Head>

      <Main>
        <Header title="Onboarding" />

        <Body>
          <div style={{ width: '100%', height: '80px' }} />
          <Transition row timeout={duration} in={animate}>
            {(state) => (
              <div
                style={{
                  transition: `${duration}ms`,
                  opacity: state === 'exited' ? 1 : 0,
                }}
              >
                {activeItem === 1 && (
                  <Username
                    onboardingData={onboardingData}
                    setOnboardingData={setOnboardingData}
                    onForwardClick={onForwardClick}
                    canContinue={canContinue}
                    setCanContinue={setCanContinue}
                  />
                )}
                {activeItem === 2 && (
                  <Name
                    onboardingData={onboardingData}
                    setOnboardingData={setOnboardingData}
                    onForwardClick={onForwardClick}
                    canContinue={canContinue}
                    setCanContinue={setCanContinue}
                  />
                )}
                {activeItem === 3 && (
                  <Title
                    onboardingData={onboardingData}
                    setOnboardingData={setOnboardingData}
                    onForwardClick={onForwardClick}
                    canContinue={canContinue}
                    setCanContinue={setCanContinue}
                  />
                )}
                {activeItem === 4 && (
                  <Image
                    onboardingData={onboardingData}
                    setOnboardingData={setOnboardingData}
                    onForwardClick={onForwardClick}
                    canContinue={canContinue}
                    setCanContinue={setCanContinue}
                  />
                )}
                {activeItem === 5 && (
                  <Done
                    onboardingData={onboardingData}
                    setOnboardingData={setOnboardingData}
                    onForwardClick={onForwardClick}
                    canContinue={canContinue}
                    setCanContinue={setCanContinue}
                  />
                )}
              </div>
            )}
          </Transition>

          <div style={{ width: '100%', height: '100px' }} />

          <Transition row timeout={duration} in={animate}>
            {(state) => (
              <div
                style={{
                  transition: `${duration}ms`,
                  opacity: state === 'exited' ? 1 : 0,
                }}
              >
                {activeItem > 1 && activeItem < items.length && (
                  <button className={styles.backButton} onClick={onBackClick}>
                    {items[activeItem - 1].buttons.backward}
                  </button>
                )}

                {activeItem < items.length && canContinue && (
                  <button
                    className={styles.forwardButton}
                    onClick={onForwardClick}
                  >
                    {items[activeItem - 1].buttons.forward}
                  </button>
                )}
              </div>
            )}
          </Transition>
        </Body>
      </Main>
    </Page>
  )
}

export default OnboardingPage
