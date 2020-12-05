import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { v4 as uuidv4 } from 'uuid'
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
  updateComponent,
  setEditingComponent,
} from '../../../context/profileContext'

import { Page, Header, Main } from '../../../components/Base'
import { GenerateEditComponent } from '../../../factories/generateEditProfile'
// import { AddComponentModal } from '../../../components/profile/AddModal'

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

    if (profileState.dnd || profileState.modal) {
      profileDispatch(setDnd(false))
      profileDispatch(setModal(false))
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

  //
  const addComponents = [
    {
      display: 'Bio',
      type: 'bio',
      props: { bio: '' },
    },
    {
      display: 'Bookshelf',
      type: 'bookshelf',
      props: { books: [] },
    },
    {
      display: 'Experiences',
      type: 'experiences',
      props: { experiences: [] },
    },
    {
      display: 'Education',
      type: 'education',
      props: { education: [] },
    },
    {
      display: 'Twitter',
      type: 'twitter',
      props: { username: '' },
    },
  ]

  const ref = useRef(null)
  useOutsideAlerter(ref, () => profileDispatch(setModal(false)))

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

      <Main>
        <Container
          onDrop={onDrop}
          nonDragAreaSelector=".static"
          lockAxis="y"
          style={{
            minHeight: 'calc(100vh - 51px)',
            paddingTop: '60px',
            paddingBottom: '80px',
          }}
        >
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
        <div ref={ref}>
          {addComponents.map((comp, idx) => (
            <AddButton key={idx} comp={comp} idx={idx} />
          ))}
        </div>
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
  const { profileState, profileDispatch } = useProfileContext()

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

const AddButton: React.FC<{ comp: any; idx: number }> = ({ comp, idx }) => {
  const { profileState, profileDispatch } = useProfileContext()

  // fadeIn/fadeOut support
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    if (profileState.modal) {
      setDisplay(true)
    }
  }, [profileState.modal])

  const handleAnimationEnd = () => {
    if (!profileState.modal) setDisplay(false)
  }

  const onClick = () => {
    profileDispatch(setModal(false))
    const newId = uuidv4().toString()
    profileDispatch(
      updateComponent({
        id: newId,
        type: comp.type,
        props: comp.props,
      })
    )
    profileDispatch(setEditingComponent(newId))
  }

  useEffect(() => {
    console.log(idx)
  }, [])

  return (
    display && (
      <button
        className={profileState.modal ? 'base slideIn' : 'base fadeOut'}
        onClick={onClick}
        style={{
          transform: `translateY(-${72 + idx * 60}px)`,
          opacity: profileState.modal ? 'unset' : 0,
        }}
        onAnimationEnd={handleAnimationEnd}
      >
        <style global jsx>{`
          .base {
            position: fixed;
            bottom: 20px;
            left: 1rem;
          }

          .slideIn {
            animation: slideIn 0.3s ease-in-out;
          }

          .fadeOut {
            animation: fadeOut 0.3s ease-in-out;
          }

          @keyframes slideIn {
            0% {
              transform: translateY(0px);
            }
          }

          @keyframes fadeOut {
            0% {
              opacity: 1;
            }
          }
        `}</style>
        Add {comp.display}
      </button>
    )
  )
}

const useOutsideAlerter = (ref: any, func: any) => {
  useEffect(() => {
    // Alert if clicked on outside of element
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        func()
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleClickOutside, true)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleClickOutside, true)
    }
  }, [ref])
}
