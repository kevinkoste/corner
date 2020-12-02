import { useState, useRef } from 'react'
import styles from './profile.module.css'

import TextareaAutosize from 'react-textarea-autosize'

import { DndShadowBox, EditIcon } from './Shared'
import {
  useProfileContext,
  updateComponent,
} from '../../context/profileContext'

import { BioProps } from '../../models/profile'

export const EditBio: React.FC<BioProps> = ({ id, props, name }) => {
  const { profileState, profileDispatch } = useProfileContext()
  const [textInput, setTextInput] = useState<string>(props.bio)

  const handleClickAway = () => {
    profileDispatch(
      updateComponent({
        id: id,
        type: 'bio',
        props: {
          bio: textInput,
        },
      })
    )
  }

  return (
    <div className={styles.container}>
      <DndShadowBox>
        <EditIcon id={id} />
        <h1>About {name.split(' ')[0]}</h1>

        {profileState.editing ? (
          <TextareaAutosize
            className={styles.textareaAutosizeP}
            onBlur={handleClickAway}
            onChange={(event: any) =>
              setTextInput(event.target.value.replace(/\s{2,}/g, ' '))
            }
            value={textInput}
            autoFocus
          />
        ) : (
          <p className={styles.bioText}>{textInput}</p>
        )}
      </DndShadowBox>
    </div>
  )
}

// public bio component
export const Bio: React.FC<BioProps> = ({ props, name }) => {
  if (props.bio !== '') {
    return (
      <div className={styles.containerPublic}>
        <h1>About {name.split(' ')[0]}</h1>
        <p className={styles.bioText}>{props.bio}</p>
      </div>
    )
  } else {
    return null
  }
}
