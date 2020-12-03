import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import styles from './[username].module.css'

import { api, apiSSR } from '../../../libs/api'
import { enableScroll, disableScroll } from '../../../libs/helpers'
import { useAppContext } from '../../../context/appContext'
import {
  useProfileContext,
  updateState,
  setEditing,
  setDnd,
  setModal,
  swapComponents,
} from '../../../context/profileContext'

import { Page, Header, Main } from '../../../components/Base'
import { GenerateEditComponent } from '../../../factories/generateEditProfile'
import { AddComponentModal } from '../../../components/profile/AddModal'

export default function EditProfilePage({ username, name, components }) {
  const router = useRouter()
  const { state } = useAppContext()
  const { profileState, profileDispatch } = useProfileContext()

  useEffect(() => {
    if (!state.auth) {
      router.push(`/app/login`)
    } else if (state.username !== username) {
      router.push(`/${username}`)
    } else {
      // get data from props and push to profile context
      profileDispatch(
        updateState({
          username: username,
          name: name,
          components: components,
        })
      )
    }
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

    if (profileState.dnd) {
      profileDispatch(setDnd(false))
      setTimeout(() => {
        profileDispatch(setEditing(!profileState.editing))
      }, 200)
    } else {
      profileDispatch(setEditing(!profileState.editing))
    }

    setTimeout(() => {
      enableScroll()
    }, 300)

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

      <Header title={name} />

      {profileState.modal && <AddComponentModal />}

      <Main style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <Container onDrop={onDrop} nonDragAreaSelector=".static" lockAxis="y">
          {profileState.components.map((comp, idx) => {
            return (
              <Draggable key={idx} className={profileState.dnd ? '' : 'static'}>
                {GenerateEditComponent(comp, name)}
              </Draggable>
            )
          })}
        </Container>

        <button className={styles.floatingButton} onClick={onSave}>
          {profileState.editing ? 'Finish Editing' : 'Edit Corner'}
        </button>

        <AddIcon />
        <DragIcon />
      </Main>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { username } = params

  const { data } = await apiSSR({
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

export const AddIcon = ({ ...props }) => {
  const { profileDispatch, profileState } = useProfileContext()

  // fadeIn/fadeOut support
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    if (profileState.editing) {
      setDisplay(true)
    }
  }, [profileState.editing])

  const handleAnimationEnd = () => {
    if (!profileState.editing) setDisplay(false)
  }

  return (
    display && (
      <img
        className={`${styles.addIcon} ${
          profileState.editing ? styles.slideIn : styles.slideOut
        }`}
        src="/icons/gray-plus.svg"
        alt="gray plus sign"
        onClick={() => profileDispatch(setModal(!profileState.modal))}
        onAnimationEnd={handleAnimationEnd}
        {...props}
      />
    )
  )
}

export const DragIcon = ({ ...props }) => {
  const { profileDispatch, profileState } = useProfileContext()

  // fadeIn/fadeOut support
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    if (profileState.editing) {
      setDisplay(true)
    }
  }, [profileState.editing])

  const handleAnimationEnd = () => {
    if (!profileState.editing) setDisplay(false)
  }

  return (
    display && (
      <img
        className={`${styles.dragIcon} ${
          profileState.editing ? styles.dragSlideIn : styles.dragSlideOut
        }`}
        src="/icons/gray-reorder.svg"
        alt="gray reorder sign"
        onClick={() => profileDispatch(setDnd(!profileState.dnd))}
        onAnimationEnd={handleAnimationEnd}
        {...props}
      />
    )
  )
}
