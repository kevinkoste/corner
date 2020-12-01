import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from './profile.module.css'

import { api } from '../../libs/api'
import { DndShadowBox, EditIcon } from './Shared'
import { ActiveInput } from '../../components/Base'
import {
  useProfileContext,
  updateComponent,
  updateEducation,
  deleteEducation,
} from '../../context/ProfileContext'

import { EducationProps } from '../../models/Profile'

export const EditEducation: React.FC<EducationProps> = ({ id, props }) => {
  const { profileState } = useProfileContext()

  return (
    <div className={styles.container}>
      <DndShadowBox>
        <EditIcon id={id} />
        <h1>Education</h1>

        {profileState.editingComponent === id && <AddEducationRow id={id} />}

        {props.education.map((edu, idx) => {
          return profileState.editingComponent === id ? (
            <EditEducationRow key={idx} education={edu} />
          ) : (
            <EducationRow key={idx} education={edu} />
          )
        })}
      </DndShadowBox>
    </div>
  )
}

// public component
export const Education: React.FC<EducationProps> = ({ props }) => {
  if (props.education.length !== 0) {
    return (
      <div className={styles.containerPublic}>
        <h1>Education</h1>
        {props.education.map((exp, idx) => (
          <EducationRow key={idx} education={exp} />
        ))}
      </div>
    )
  } else {
    return null
  }
}

function EducationRow({ education, ...props }) {
  const { domain, degree, school, date } = education

  return (
    <div className={styles.rowContainer} {...props}>
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
        <p>{degree}</p>
        <p>{school}</p>
        <p>{date}</p>
      </div>
    </div>
  )
}

function EditEducationRow({ education, ...props }) {
  const { id, domain, degree, school, date } = education
  const { profileDispatch } = useProfileContext()

  const [degreeInput, setDegreeInput] = useState(degree)
  const [schoolInput, setSchoolInput] = useState(school)
  const [dateInput, setDateInput] = useState(date)

  const handleClickAway = () => {
    profileDispatch(
      updateEducation({
        id: id,
        domain: domain,
        degree: degreeInput,
        school: schoolInput,
        date: dateInput,
      })
    )
  }

  const handleDeleteEducation = () => {
    profileDispatch(
      deleteEducation({
        id: id,
        domain: domain,
        degree: degreeInput,
        school: schoolInput,
        date: dateInput,
      })
    )
  }

  return (
    <div className={styles.rowContainer} {...props}>
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
          onClick={handleDeleteEducation}
        />
      </div>

      <div className={styles.rowText}>
        <input
          className={styles.rowInput}
          placeholder={'B.S. Mechanical Engineering'}
          onChange={(event: any) => setDegreeInput(event.target.value)}
          value={degreeInput}
          onBlur={handleClickAway}
        />
        <input
          className={styles.rowInput}
          placeholder={'Yale University'}
          onChange={(event: any) => setSchoolInput(event.target.value)}
          value={schoolInput}
          onBlur={handleClickAway}
        />
        <input
          className={styles.rowInput}
          placeholder={'2015 - 2019'}
          onChange={(event: any) => setDateInput(event.target.value)}
          value={dateInput}
          onBlur={handleClickAway}
        />
      </div>
    </div>
  )
}

function AddEducationRow({ id, ...props }) {
  const { profileState, profileDispatch } = useProfileContext()

  const [textInput, setTextInput] = useState('')
  const [education, setEducation] = useState({
    id: uuidv4().toString(),
    domain: '',
    degree: 'B.S. Mechanical Engineering',
    school: 'Yale University',
    date: '2015 - 2019',
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
        setEducation({ ...education, school: data || '', domain: textInput })
      }
    }, 200)
    return () => clearTimeout(delayDebounceFn)
  }, [textInput])

  // save new education item
  const onAcceptClick = () => {
    profileDispatch(
      updateComponent({
        id: id,
        type: 'education',
        props: {
          education: [
            education,
            ...profileState.components.find((comp) => comp.type === 'education')
              ?.props.education,
          ],
        },
      })
    )
    setTextInput('')
    setEducation({
      id: uuidv4().toString(),
      domain: '',
      degree: 'B.S. Mechanical Engineering',
      school: 'Yale University',
      date: '2015 - 2019',
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
    <div className={styles.addContainer} {...props}>
      <div className={styles.addFormContainer}>
        {/* <p>Enter your school's website URL</p> */}
        <ActiveInput
          className={styles.rowAddInput}
          style={{ textTransform: 'lowercase' }}
          label="University domain name, e.g. yale.edu"
          value={textInput}
          onChange={(event: any) => setTextInput(event.target.value)}
          onKeyDown={onKeyDown}
          spellCheck="false"
          autoFocus
        />
      </div>
      {textInput !== '' && (
        <div onClick={onAcceptClick}>
          <PreviewEducationRow education={education} />
        </div>
      )}
    </div>
  )
}

function PreviewEducationRow({ education }) {
  const { domain, school } = education

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
        <p>{school || 'e.g. Yale University'}</p>
      </div>
    </div>
  )
}
