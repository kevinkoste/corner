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
  updateProfile,
  setEditing,
  setModal,
  swapComponents,
} from '../../../context/ProfileContext'

import Header from '../../../components/Header'
import { Page } from '../../../components/Base'
import { GenerateEditComponent } from '../../../factories/ProfileEdit'

function EditProfilePage({ profile, name }) {
  const router = useRouter()
  const { state } = useAppContext()
  const { profileState, profileDispatch } = useProfileContext()

  useEffect(() => {
    if (state.username !== profile.username) {
      router.push(`${profile.username}`)
    }
    // get data from props and push to profile context
    profileDispatch(updateProfile(profile))
  }, [])

  // on save profile, post new profile data to server, NOT async
  const onSave = () => {
    disableScroll()
    setTimeout(() => {
      enableScroll()
    }, 100)
    if (profileState.editing) {
      api({
        method: 'post',
        url: `/protect/components`,
        data: {
          components: profileState.profile.components,
        },
      })
    }
    profileDispatch(setEditing(!profileState.editing))
  }

  // helper function for drag and drop support
  const onDrop = (dropResult: any) => {
    const { removedIndex, addedIndex } = dropResult
    console.log('in onDrop, removed: ', removedIndex, 'added:', addedIndex)
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

      <main className={styles.main}>
        <Header title={name} />

        <div className={styles.body}>
          <Container
            onDrop={onDrop}
            nonDragAreaSelector=".static"
            // dragClass='animate'
            // dragHandleSelector=".field"
            lockAxis="y"
          >
            {profileState.profile.components.map((comp, idx) => {
              if (
                comp.type == 'bio' ||
                comp.type == 'headline' ||
                comp.type == 'headshot'
              ) {
                return (
                  <Draggable key={idx}>
                    {GenerateEditComponent(comp, name)}
                  </Draggable>
                )
              }
            })}
          </Container>
        </div>

        <button className={styles.floatingButton} onClick={onSave}>
          {profileState.editing ? 'Finish Editing' : 'Edit Corner'}
        </button>

        <div style={{ width: '100%', height: '80px' }} />
      </main>
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
      profile: {
        username: username,
        components: components,
      },
      name: name,
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
