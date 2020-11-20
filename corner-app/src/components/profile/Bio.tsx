import { useState } from 'react'
import styles from './Bio.module.css'

import TextareaAutosize from 'react-textarea-autosize'

import {
  useProfileContext,
  updateComponent,
} from '../../context/ProfileContext'

type BioProps = {
  id: string
  props: any
  name: string
}

export const EditBio: React.FC<BioProps> = ({ id, props, name }) => {
  const { profileState, profileDispatch } = useProfileContext()
  const [textInput, setTextInput] = useState<string>(props.bio)
  const placeholder =
    'He’s currently a security engineer at BigCo, where he’s helping to build a system wide penetration testing platform to keep BigCo’s systems safe. A big advocate for the EFF, part-time white hat hacker, and proud member of the Information Systems Security Association, John also founded the young hacker coalition (YHC) in 2018. John loves to travel internationally, and is rarely found abroad without a camera in his hand. You can find him in San Francisco, California.'

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

  if (profileState.editing) {
    return (
      <div className={styles.container}>
        <div className={styles.shadowBox}>
          <h1 style={{ color: textInput === '' ? 'lightgray' : 'black' }}>
            About {name.split(' ')[0]}
          </h1>
          <TextareaAutosize
            className={styles.textareaAutosize}
            placeholder={placeholder}
            onBlur={handleClickAway}
            onChange={(event: any) =>
              setTextInput(event.target.value.replace(/\s{2,}/g, ' '))
            }
            value={textInput}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.containerPublic + ' static'}>
        <h1>About {name.split(' ')[0]}</h1>
        <p>{textInput}</p>
      </div>
    )
  }
}

// public bio component
export const Bio: React.FC<BioProps> = ({ props, name }) => {
  if (props.bio !== '') {
    return (
      <div className={styles.containerPublic}>
        <h1>About {name.split(' ')[0]}</h1>
        <p>{props.bio}</p>
      </div>
    )
  }
}
