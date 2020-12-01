import { v4 as uuidv4 } from 'uuid'
import styles from './profile.module.css'

import {
  useProfileContext,
  setModal,
  updateComponent,
} from '../../context/ProfileContext'

export const AddComponentModal = () => {
  const { profileDispatch } = useProfileContext()

  const components = [
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
      display: 'Integrations',
      type: 'integrations',
      props: { integrations: [] },
    },
  ]

  return (
    <div
      className={styles.modal}
      onClick={() => profileDispatch(setModal(false))}
    >
      {components.map((comp, idx) => (
        <button
          key={idx}
          onClick={() => {
            profileDispatch(setModal(false))
            profileDispatch(
              updateComponent({
                id: uuidv4().toString(),
                type: comp.type,
                props: comp.props,
              })
            )
          }}
          style={{ marginBottom: '12px' }}
        >
          Add {comp.display}
        </button>
      ))}
    </div>
  )
}
