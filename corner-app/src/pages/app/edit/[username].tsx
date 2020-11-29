import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import styles from './[username].module.css'

import { api } from '../../../libs/api'
import { useAppContext } from '../../../context/AppContext'
import {
  useProfileContext,
  updateState,
  setEditing,
  setDnd,
  swapComponents,
} from '../../../context/ProfileContext'

import Header from '../../../components/Header'
import { Page, Main, Body } from '../../../components/Base'
import { GenerateEditComponent } from '../../../factories/GenerateEditProfile'

function EditProfilePage({ username, name, components }) {
  const router = useRouter()
  const { state } = useAppContext()
  const { profileState, profileDispatch } = useProfileContext()

  useEffect(() => {
    if (state.username !== username) {
      router.push(`${username}`)
    }
    // get data from props and push to profile context
    profileDispatch(
      updateState({
        username: username,
        name: name,
        components: components,
      })
    )
  }, [])

  useEffect(() => {
    const cleanClasses = () => {
      document.body.className = ''
    }
    document.addEventListener('touchend', cleanClasses, false)
    return () => {
      document.removeEventListener('touchend', cleanClasses, false)
    }
  }, [])

  // on save profile, post new profile data to server, NOT async
  const onSave = () => {
    disableScroll()
    profileDispatch(setDnd(false))
    setTimeout(() => {
      profileDispatch(setEditing(!profileState.editing))
    }, 300)
    setTimeout(() => {
      enableScroll()
    }, 350)
    if (profileState.editing) {
      api({
        method: 'post',
        url: `/protect/components`,
        data: {
          components: profileState.components,
        },
      })
    }
  }

  // helper function for drag and drop support
  const onDrop = (dropResult: any) => {
    const { removedIndex, addedIndex } = dropResult
    profileDispatch(swapComponents(removedIndex, addedIndex))
  }

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
        {!profileState.editing && <Header title={name} />}

        {profileState.editing && (
          <div className={styles.menuBar}>
            <img
              className={styles.menuIcon}
              src="/icons/green-checkmark.svg"
              alt="green checkmark"
            />
            <img
              className={styles.menuIcon}
              src="/icons/gray-settings.svg"
              alt="gray settings"
            />
            <img
              className={styles.menuIcon}
              src="/icons/gray-reorder.svg"
              alt="gray reorder"
              onClick={() => profileDispatch(setDnd(!profileState.dnd))}
            />

            <img
              className={styles.menuIcon}
              src="/icons/gray-plus.svg"
              alt="green plus sign"
            />
          </div>
        )}

        <Body style={{ paddingBottom: '80px' }}>
          <Container
            onDrop={onDrop}
            nonDragAreaSelector=".static"
            // dragClass='animate'
            // dragHandleSelector=".field"
            lockAxis="y"
          >
            {profileState.components.map((comp, idx) => {
              return (
                <Draggable
                  key={idx}
                  className={profileState.dnd ? '' : 'static'}
                >
                  {GenerateEditComponent(comp, name)}
                </Draggable>
              )
            })}
          </Container>

          <button className={styles.floatingButton} onClick={onSave}>
            {profileState.editing ? 'Finish Editing' : 'Edit Corner'}
          </button>
        </Body>
      </Main>
    </Page>
  )
}

export default EditProfilePage

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

// helper functions to avoid jitter when
// "edit" components replace "public" components
function disableScroll() {
  // Get the current page scroll position
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

  // if any scroll is attempted, set this to the previous value
  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop)
  }
}
function enableScroll() {
  window.onscroll = function () {}
}
