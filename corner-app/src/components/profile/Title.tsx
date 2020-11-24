import { useState } from 'react'
import styles from './profile.module.css'

import TextareaAutosize from 'react-textarea-autosize'

import {
  useProfileContext,
  updateComponent,
} from '../../context/ProfileContext'

type TitleProps = {
  id: string
  props: any
}

export const EditTitle: React.FC<TitleProps> = ({ id, props }) => {
  const { profileState, profileDispatch } = useProfileContext()

  const [textInput, setTextInput] = useState<string>(props.headline)

  const placeholder =
    'John Kauber is a Security Engineer and Analyst passionate about protecting critical systems from threat of attack.'

  const handleClickAway = () => {
    profileDispatch(
      updateComponent({
        id: id,
        type: 'headline',
        props: {
          headline: textInput,
        },
      })
    )
  }

  if (profileState.editing) {
    return (
      <div className={styles.container}>
        <div className={styles.shadowBox}>
          {/* <ComponentMenu> */}
          <TextareaAutosize
            className={styles.textareaAutosizeH1}
            placeholder={placeholder}
            onBlur={handleClickAway}
            onChange={(event: any) => setTextInput(event.target.value)}
            value={textInput}
          />
          {/* </ComponentMenu> */}
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.containerPublic + ' static'}>
        <h1 className={styles.titleText}>{textInput}</h1>
      </div>
    )
  }
}

// public bio component
export const Title: React.FC<TitleProps> = ({ props }) => {
  if (props.headline !== '') {
    return (
      <div className={styles.containerPublic}>
        <h1>{props.headline}</h1>
      </div>
    )
  } else {
    return null
  }
}
