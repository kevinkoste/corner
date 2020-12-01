import { useEffect, useState } from 'react'
import styles from './Base.module.css'

import BeatLoader from 'react-spinners/BeatLoader'

export const Page = ({ children, ...props }) => {
  const [height, setHeight] = useState(
    window.innerHeight *
      (document.documentElement.clientWidth / window.innerWidth)
  )

  useEffect(() => {
    setHeight(
      window.innerHeight *
        (document.documentElement.clientWidth / window.innerWidth)
    )
  }, [window.innerHeight])

  return (
    <div className={styles.page} style={{ height: `${height}px` }} {...props}>
      {children}
    </div>
  )
}

export const Main = ({ children, ...props }) => {
  return (
    <main className={styles.main} {...props}>
      {children}
    </main>
  )
}

export const Body = ({ children, ...props }) => {
  return (
    <div className={styles.body} {...props}>
      {children}
    </div>
  )
}

export const Loader = ({ ...props }) => {
  return (
    <div className={styles.loader} {...props}>
      <BeatLoader loading={true} color={'#333333'} />
    </div>
  )
}

export const ActiveInput = ({ value, label, ...props }) => {
  const [activated, setActivated] = useState(false)

  const handleFocus = () => {
    if ('onFocus' in props) {
      props.onFocus()
    }
    if (!activated) {
      setActivated(true)
    }
  }

  const handleBlur = () => {
    if ('onBlur' in props) {
      props.onBlur()
    }
    if (value == '') {
      setActivated(false)
    }
  }

  return (
    <div className={styles.activeInputWrapper}>
      <div className={styles.activeInput}>
        {'prefix' in props ? <p>{props.prefix}</p> : null}
        <input
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </div>
      <p
        className={
          activated ? styles.activeInputLabelOn : styles.activeInputLabelOff
        }
      >
        {label}
      </p>
    </div>
  )
}
