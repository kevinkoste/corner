import { useState } from 'react'
import styles from './profile.module.css'

import TextareaAutosize from 'react-textarea-autosize'
import { DndShadowBox } from '../../components/profile/DndShadowBox'

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

  const [editing, setEditing] = useState(false)

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

  return (
    <div className={styles.container}>
      <DndShadowBox>
        {profileState.editing && (
          <img
            className={styles.absoluteEditIcon}
            src={
              editing
                ? '/icons/green-checkmark.svg'
                : '/icons/gray-settings.svg'
            }
            alt="toggle menu"
            onClick={() => setEditing(!editing)}
          />
        )}
        {profileState.editing ? (
          <TextareaAutosize
            className={styles.textareaAutosizeH1}
            onBlur={handleClickAway}
            onChange={(event: any) => setTextInput(event.target.value)}
            value={textInput}
            disabled={profileState.dnd}
          />
        ) : (
          <h1 className={styles.titleText}>{textInput}</h1>
        )}
      </DndShadowBox>
    </div>
  )
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
