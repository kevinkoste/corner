import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from './profile.module.css'

import { api } from '../../libs/api'
import {
  useProfileContext,
  updateComponent,
  updateExperience,
  deleteExperience,
} from '../../context/ProfileContext'

import { ExperienceProps } from '../../models/Profile'

export const EditExperience: React.FC<ExperienceProps> = ({ id, props }) => {
  const { profileState } = useProfileContext()

  if (profileState.editing) {
    return (
      <div className={styles.container}>
        <div className={styles.shadowBox}>
          <h1>Experience</h1>
          <AddExperienceRow id={id} />
          {props.experiences.map((exp, idx) => (
            <EditExperienceRow key={idx} experience={exp} />
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.containerPublic + ' static'}>
        <h1>Experience</h1>
        {props.experiences.map((exp, idx) => (
          <ExperienceRow key={idx} experience={exp} />
        ))}
      </div>
    )
  }
}

// public component
export const Experience: React.FC<ExperienceProps> = ({ props }) => {
  if (props.experiences.length !== 0) {
    return (
      <div className={styles.containerPublic}>
        <h1>Experience</h1>
        {props.experiences.map((exp, idx) => (
          <ExperienceRow key={idx} experience={exp} />
        ))}
      </div>
    )
  } else {
    return null
  }
}

function ExperienceRow({ experience }) {
  const { domain, title, company, date } = experience

  return (
    <div className={styles.rowContainer}>
      <img
        className={styles.rowImage}
        src={`//logo.clearbit.com/${domain}`}
        key={domain}
        onError={(event: any) => {
          event.target.onError = null
          event.target.src = '/icons/building.svg'
        }}
      />
      <div className={styles.rowText}>
        <p>{title}</p>
        <p>{company}</p>
        <p>{date}</p>
      </div>
    </div>
  )
}

function EditExperienceRow({ experience }) {
  const { id, domain, title, company, date } = experience
  const { profileDispatch } = useProfileContext()

  const [titleInput, setTitleInput] = useState(title)
  const [companyInput, setCompanyInput] = useState(company)
  const [dateInput, setDateInput] = useState(date)

  const handleClickAway = () => {
    profileDispatch(
      updateExperience({
        id: id,
        domain: domain,
        title: titleInput,
        company: companyInput,
        date: dateInput,
      })
    )
  }

  const handleDeleteExperience = () => {
    profileDispatch(
      deleteExperience({
        id: id,
        domain: domain,
        title: titleInput,
        company: companyInput,
        date: dateInput,
      })
    )
  }

  return (
    <div className={styles.rowContainer}>
      <div className={styles.rowImageContainer}>
        <img
          className={styles.rowImage}
          src={`//logo.clearbit.com/${domain}`}
          key={domain}
          onError={(event: any) => {
            event.target.onError = null
            event.target.src = '/icons/building.svg'
          }}
        />
        <img
          className={styles.rowDeleteImage}
          src="/icons/x-black.svg"
          onClick={handleDeleteExperience}
        />
      </div>

      <div className={styles.rowText}>
        <input
          className={styles.rowInput}
          placeholder={'Analyst'}
          onChange={(event: any) => setTitleInput(event.target.value)}
          value={titleInput}
          onBlur={handleClickAway}
        />
        <input
          className={styles.rowInput}
          placeholder={'Acme Corp'}
          onChange={(event: any) => setCompanyInput(event.target.value)}
          value={companyInput}
          onBlur={handleClickAway}
        />
        <input
          className={styles.rowInput}
          placeholder={'August 2019 - Present'}
          onChange={(event: any) => setDateInput(event.target.value)}
          value={dateInput}
          onBlur={handleClickAway}
        />
      </div>
    </div>
  )
}

function AddExperienceRow({ id }) {
  const { profileState, profileDispatch } = useProfileContext()

  const [textInput, setTextInput] = useState('')
  const [experience, setExperience] = useState({
    id: uuidv4().toString(),
    domain: '',
    title: 'Analyst',
    company: 'Acme Corp',
    date: 'September 2018 - Present',
  })

  // update data on a timeout (debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (textInput !== '' && textInput.split('.').length > 1) {
        const { data } = await api({
          method: 'get',
          url: `/public/employer`,
          params: {
            domain: textInput,
          },
        })
        setExperience({ ...experience, company: data || '', domain: textInput })
      }
    }, 200)
    return () => clearTimeout(delayDebounceFn)
  }, [textInput])

  // save new experience item
  const onAcceptClick = () => {
    profileDispatch(
      updateComponent({
        id: id,
        type: 'experiences',
        props: {
          experiences: [
            ...profileState.components.find(
              (comp) => comp.type === 'experiences'
            )?.props.experiences,
            experience,
          ],
        },
      })
    )
    setTextInput('')
    setExperience({
      id: uuidv4().toString(),
      domain: '',
      title: 'Analyst',
      company: 'Acme Corp',
      date: 'September 2018 - Present',
    })
  }

  // enter key advances form
  const onKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onAcceptClick()
    }
  }

  return (
    <div className={styles.addContainer}>
      <div className={styles.addFormContainer}>
        <p>Enter your company's website URL</p>
        <input
          className={styles.rowAddInput}
          type="url"
          placeholder={'acme.com'}
          onChange={(event: any) => setTextInput(event.target.value)}
          value={textInput}
          onKeyDown={onKeyDown}
        />
      </div>
      {textInput !== '' && (
        <div onClick={onAcceptClick}>
          <PreviewExperienceRow experience={experience} />
        </div>
      )}
    </div>
  )
}

function PreviewExperienceRow({ experience }) {
  const { domain, company } = experience

  return (
    <div className={styles.rowContainer}>
      <img
        className={styles.rowImage}
        src={`//logo.clearbit.com/${domain}`}
        key={domain}
        onError={(event: any) => {
          event.target.onError = null
          event.target.src = '/icons/building.svg'
        }}
      />
      <div className={styles.rowText} style={{ color: 'gray' }}>
        <p>{company || 'e.g. Acme Corp'}</p>
      </div>
    </div>
  )
}
