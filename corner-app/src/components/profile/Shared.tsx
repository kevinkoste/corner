import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import styles from './profile.module.css'

import {
  useProfileContext,
  setEditingComponent,
  deleteComponent,
} from '../../context/ProfileContext'

export const DndShadowBox = ({ children, ...props }) => {
  const { profileState } = useProfileContext()

  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const collapsedHeight = 85

  useEffect(() => {
    // if this fires while profileState.dnd, this element has just been "dropped"
    // need to force it into the "collapsed" state
    if (profileState.dnd) {
      ref.current.style.height = `${collapsedHeight}px`
      setCollapsed(true)
      setMounted(true) // unsure if this is needed
    }
  }, [])

  useLayoutEffect(() => {
    if (mounted) {
      if (collapsed) {
        expand()
      } else {
        collapse()
      }
    } else {
      setMounted(true)
    }
  }, [profileState.dnd])

  const collapse = () => {
    // get the height of the element's inner content, regardless of its actual size
    const sectionHeight = ref.current.scrollHeight
    console.log(sectionHeight)

    // temporarily disable all css transitions
    const elementTransition = ref.current.style.transition
    ref.current.style.transition = ''

    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we
    // aren't transitioning out of 'auto'
    requestAnimationFrame(() => {
      ref.current.style.height = `${sectionHeight}px`
      ref.current.style.transition = elementTransition

      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(() => {
        ref.current.style.height = `${collapsedHeight}px`
      })
    })

    // mark the section as "currently collapsed"
    setCollapsed(true)
  }

  const expand = () => {
    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = ref.current.scrollHeight

    // have the element transition to the height of its inner content
    ref.current.style.height = sectionHeight + 'px'

    // when the next css transition finishes (which should be the one we just triggered)
    ref.current.addEventListener('transitionend', function callback() {
      // remove this event listener so it only gets triggered once
      ref.current.removeEventListener('transitionend', callback)

      // remove "height" from the element's inline styles, so it can return to its initial value
      ref.current.style.height = null
    })

    // mark the section as "currently not collapsed"
    setCollapsed(false)
  }

  return (
    <div
      ref={ref}
      className={styles.shadowBox}
      style={{
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

export const EditIcon = ({ id, ...props }) => {
  const { profileDispatch, profileState } = useProfileContext()

  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setEditing(profileState.editingComponent === id)
  }, [profileState.editingComponent])

  const handleClick = () => {
    if (editing) {
      profileDispatch(setEditingComponent(''))
    } else {
      profileDispatch(setEditingComponent(id))
    }
  }

  // fadeIn/fadeOut support
  const [display, setDisplay] = useState(false)
  const [animating, setAnimating] = useState(true)

  useEffect(() => {
    if (profileState.editing) {
      setDisplay(true)
    }
    setAnimating(profileState.editing && !profileState.dnd)
  }, [profileState.editing, profileState.dnd])

  const handleAnimationEnd = () => {
    if (!profileState.editing || profileState.dnd) setDisplay(false)
  }

  return (
    display && (
      <>
        <img
          className={`${styles.editIcon} ${
            animating ? styles.fadeIn : styles.fadeOut
          }`}
          src={
            editing ? '/icons/green-checkmark.svg' : '/icons/gray-settings.svg'
          }
          alt="toggle menu"
          onClick={handleClick}
          onAnimationEnd={handleAnimationEnd}
          {...props}
        />
        <DeleteIcon show={editing} id={id} {...props} />
      </>
    )
  )
}

export const DeleteIcon = ({ show, id, ...props }) => {
  const { profileDispatch } = useProfileContext()

  const [display, setDisplay] = useState(false)

  const handleClick = () => {
    profileDispatch(deleteComponent(id))
  }

  // animation support
  useEffect(() => {
    console.log('in show useeffect with show: ', show)
    if (show) {
      setDisplay(true)
    }
  }, [show])

  const handleAnimationEnd = () => {
    console.log('in animEnd with show: ', show)
    if (!show) setDisplay(false)
  }

  return (
    display && (
      <img
        className={`${styles.deleteIcon} ${
          show ? styles.deleteIn : styles.deleteOut
        }`}
        src={'/icons/red-x.svg'}
        alt="delete component"
        onClick={handleClick}
        onAnimationEnd={handleAnimationEnd}
        {...props}
      />
    )
  )
}
