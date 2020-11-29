import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import styles from './profile.module.css'

import { useProfileContext } from '../../context/ProfileContext'

export const DndShadowBox = ({ children, ...props }) => {
  const { profileState } = useProfileContext()

  const [origHeight, setOrigHeight] = useState(0)
  const [height, setHeight] = useState('unset')
  const ref = useRef(null)

  useEffect(() => {
    if (profileState.dnd) {
      // when dnd is selected, set height from 'unset' to the calculated height
      setHeight(`${origHeight}px`)
      // after 30ms, start animation by setting height to 85px
      setTimeout(() => {
        setHeight(`85px`)
      }, 30)
    } else {
      setHeight(`${origHeight}px`)
      setTimeout(() => {
        setHeight(`unset`)
      }, 300)
    }
  }, [profileState.dnd])

  useLayoutEffect(() => {
    // get initial height after render
    const latestHeight = Math.max(origHeight, ref.current.clientHeight)
    setOrigHeight(latestHeight)
  }, [ref.current, profileState.editing])

  return (
    <div
      className={styles.shadowBox}
      ref={ref}
      style={{
        height: height,
        boxShadow: profileState.dnd
          ? `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`
          : 'unset',
      }}
      {...props}
    >
      {profileState.dnd && <div className={styles.bottomGradient} />}
      {children}
    </div>
  )
}
