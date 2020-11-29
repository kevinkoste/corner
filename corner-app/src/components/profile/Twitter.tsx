import { useState } from 'react'
import styles from './profile.module.css'

import { ActiveInput } from '../../components/Base'
import { Timeline } from 'react-twitter-widgets'

import {
  useProfileContext,
  updateComponent,
} from '../../context/ProfileContext'

type TwitterProps = {
  id: string
  props: any
}

export const EditTwitter: React.FC<TwitterProps> = ({ id, props }) => {
  const { profileState, profileDispatch } = useProfileContext()

  const [textInput, setTextInput] = useState('')
  const [username, setUsername] = useState<string>(props.username)

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
    setUsername(textInput)
  }

  if (profileState.dnd) {
    return (
      <div className={styles.container}>
        <div className={styles.shadowBox}>
          <ActiveInput
            // className={styles.activeInput}
            label="Twitter"
            prefix="@"
            value={textInput}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            spellCheck="false"
            autoFocus
          />
          <Timeline
            dataSource={{
              sourceType: 'profile',
              screenName: username,
            }}
            options={{
              height: '400',
            }}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.containerPublic + ' static'}>
        <h1 className={styles.titleText}>{textInput}</h1>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: username,
          }}
          options={{
            height: '400',
          }}
        />
      </div>
    )
  }
}

// public twitter component
export const Twitter: React.FC<TwitterProps> = ({ props }) => {
  if (props.headline !== '') {
    return (
      <div className={styles.containerPublic}>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: props.username,
          }}
          options={{
            height: '400',
          }}
        />
      </div>
    )
  } else {
    return null
  }
}
