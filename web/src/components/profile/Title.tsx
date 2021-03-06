import { useState } from 'react'
import styles from './profile.module.css'

import TextareaAutosize from 'react-textarea-autosize'
import { DndShadowBox, EditIcon } from './Shared'

import {
  useProfileContext,
  updateComponent,
} from '../../context/profileContext'

import { TitleProps } from '../../models/profile'

export const EditTitle: React.FC<TitleProps> = ({ id, props }) => {
  const { profileState, profileDispatch } = useProfileContext()

  const [textInput, setTextInput] = useState<string>(props.headline)

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
        <EditIcon id={id} style={{ top: '0px' }} />

        {profileState.editingComponent === id ? (
          <TextareaAutosize
            className={styles.textareaAutosizeH1}
            onBlur={handleClickAway}
            onChange={(event: any) => setTextInput(event.target.value)}
            value={textInput}
            disabled={profileState.dnd}
            autoFocus
          />
        ) : (
          <h1 className={styles.titleText}>{textInput}</h1>
        )}
      </DndShadowBox>
    </div>
  )
}

// public title component
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
