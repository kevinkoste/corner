import { useState, useEffect } from 'react'
import styles from './profile.module.css'

import { ActiveInput } from '../../components/Base'
import { Timeline } from 'react-twitter-widgets'
import { DndShadowBox, EditIcon } from './Shared'

import {
  useProfileContext,
  updateComponent,
} from '../../context/profileContext'

import { TwitterProps } from '../../models/profile'

export const EditTwitter: React.FC<TwitterProps> = ({ id, props }) => {
  const { profileState, profileDispatch } = useProfileContext()

  const [textInput, setTextInput] = useState('')
  const [username, setUsername] = useState<string>(props.username)

  // update data on a timeout (debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (textInput !== '') {
        setUsername(textInput)
        profileDispatch(
          updateComponent({
            id: id,
            type: 'twitter',
            props: {
              username: textInput,
            },
          })
        )
      }
    }, 200)
    return () => clearTimeout(delayDebounceFn)
  }, [textInput])

  const handleChange = (event: any) => {
    setTextInput(event.target.value)
  }

  // enter key advances form
  const onKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onSubmit()
    }
  }

  const onSubmit = () => {
    profileDispatch(
      updateComponent({
        id: id,
        type: 'twitter',
        props: {
          username: username,
        },
      })
    )
  }

  return (
    <div className={styles.container}>
      <DndShadowBox>
        <EditIcon id={id} />
        <h1 style={{ marginBottom: '1rem' }}>Twitter</h1>

        {profileState.editingComponent === id && (
          <ActiveInput
            label="Twitter username"
            prefix="@"
            value={textInput}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            spellCheck="false"
            autoFocus
          />
        )}
        <div
          style={{
            minHeight: '375px',
            marginTop: '1rem',
            opacity: profileState.dnd ? 0 : 1,
          }}
        >
          <Timeline
            dataSource={{
              sourceType: 'profile',
              screenName: username,
            }}
            options={{
              height: '375',
              chrome: 'transparent, noheader, nofooter',
              borderColor: '#999',
              dnt: true,
            }}
          />
        </div>
      </DndShadowBox>
    </div>
  )
}

// public twitter component
export const Twitter: React.FC<TwitterProps> = ({ props }) => {
  if (props.username !== '') {
    return (
      <div className={styles.containerPublic}>
        <h1 style={{ marginBottom: '1rem' }}>Twitter</h1>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: props.username,
          }}
          options={{
            height: '375',
            chrome: 'transparent, noheader, nofooter',
            borderColor: '#999',
            dnt: true,
          }}
        />
      </div>
    )
  } else {
    return null
  }
}
