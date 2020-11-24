import React, { createContext, useReducer, useContext, Dispatch } from 'react'

import { Component } from '../models/Profile'

type StateType = {
  username: string
  name: string
  components: Component[]
  editing: boolean
  modal: boolean
}

const initialState: StateType = {
  username: '',
  name: '',
  components: [],
  editing: false,
  modal: false,
}

type ProfileContextType = {
  profileState: StateType
  profileDispatch: Dispatch<Action>
}

const ProfileContext = createContext<ProfileContextType>({
  profileState: initialState,
  profileDispatch: () => null,
})

// Action constants
const UPDATE_STATE = 'UPDATE_STATE'
const SET_EDITING = 'SET_EDITING'
const SET_MODAL = 'SET_MODAL'

const UPDATE_COMPONENT = 'UPDATE_COMPONENT'
const DELETE_COMPONENT = 'DELETE_COMPONENT'
const SWAP_COMPONENTS = 'SWAP_COMPONENTS'

const UPDATE_EXPERIENCE = 'UPDATE_EXPERIENCE'
const DELETE_EXPERIENCE = 'DELETE_EXPERIENCE'
const UPDATE_EDUCATION = 'UPDATE_EDUCATION'
const DELETE_EDUCATION = 'DELETE_EDUCATION'
const DELETE_BOOK_BY_ID = 'DELETE_BOOK_BY_ID'
const DELETE_INTEGRATION = 'DELETE_INTEGRATION'

// Valid action types
type Action =
  | { type: 'UPDATE_STATE'; state: any }
  | { type: 'SET_EDITING'; editing: boolean }
  | { type: 'SET_MODAL'; modal: boolean }
  | { type: 'UPDATE_COMPONENT'; component: any }
  | { type: 'DELETE_COMPONENT'; id: string }
  | { type: 'SWAP_COMPONENTS'; fromIdx: number; toIdx: number }
  | { type: 'UPDATE_EXPERIENCE'; experience: any }
  | { type: 'DELETE_EXPERIENCE'; experience: any }
  | { type: 'UPDATE_EDUCATION'; education: any }
  | { type: 'DELETE_EDUCATION'; education: any }
  | { type: 'DELETE_BOOK_BY_ID'; id: string }
  | { type: 'DELETE_INTEGRATION'; id: string }

// Action creators
export const updateState = (state: any): Action => {
  return { type: UPDATE_STATE, state: state }
}

export const setEditing = (editing: boolean): Action => {
  return { type: SET_EDITING, editing: editing }
}

export const setModal = (modal: boolean): Action => {
  return { type: SET_MODAL, modal: modal }
}

export const updateComponent = (component: any): Action => {
  return { type: UPDATE_COMPONENT, component: component }
}

export const deleteComponent = (id: string): Action => {
  return { type: DELETE_COMPONENT, id: id }
}

export const swapComponents = (fromIdx: number, toIdx: number): Action => {
  return { type: SWAP_COMPONENTS, fromIdx: fromIdx, toIdx: toIdx }
}

export const updateExperience = (experience: any): Action => {
  return { type: UPDATE_EXPERIENCE, experience: experience }
}

export const deleteExperience = (experience: any): Action => {
  return { type: DELETE_EXPERIENCE, experience: experience }
}

export const updateEducation = (education: any): Action => {
  return { type: UPDATE_EDUCATION, education: education }
}

export const deleteEducation = (education: any): Action => {
  return { type: DELETE_EDUCATION, education: education }
}

export const deleteBookById = (id: string): Action => {
  return { type: DELETE_BOOK_BY_ID, id: id }
}

export const deleteIntegration = (id: string): Action => {
  return { type: DELETE_INTEGRATION, id: id }
}

// Reducer
const ProfileReducer = (state: StateType, action: Action) => {
  switch (action.type) {
    case UPDATE_STATE:
      return {
        ...state,
        ...action.state,
      }

    case SET_EDITING:
      return {
        ...state,
        editing: action.editing,
      }

    case SET_MODAL:
      return {
        ...state,
        modal: action.modal,
      }

    case UPDATE_COMPONENT:
      if (
        state.components.find(
          (component) => component.id === action.component.id
        ) === undefined
      ) {
        // component doesn't exist, add it
        return {
          ...state,
          components: [...state.components, action.component],
        }
      } else {
        // component exists, update it!
        return {
          ...state,
          components: state.components.map((component) =>
            component.id === action.component.id ? action.component : component
          ),
        }
      }

    case DELETE_COMPONENT:
      return {
        ...state,
        components: state.components.filter(
          (component) => component.id !== action.id
        ),
      }

    case SWAP_COMPONENTS:
      console.log(
        'in swap components from: ',
        action.fromIdx,
        'to: ',
        action.toIdx
      )

      const comp = state.components[action.fromIdx]
      const removed = state.components.filter(
        (val, idx) => idx !== action.fromIdx
      )

      console.log('removed component is: ', comp)

      console.log('remaining comp array is: ', removed)

      if (action.toIdx === 0) {
        return {
          ...state,
          components: [comp, ...removed],
        }
      }

      if (action.toIdx === state.components.length - 1) {
        return {
          ...state,
          components: [...removed, comp],
        }
      }

      return {
        ...state,
        components: [
          ...removed.slice(0, action.toIdx),
          comp,
          ...removed.slice(action.toIdx),
        ],
      }

    case UPDATE_EXPERIENCE:
      return {
        ...state,
        components: state.components.map((comp) =>
          comp.type !== 'experiences'
            ? comp
            : {
                ...state.components.find((comp) => comp.type === 'experiences'),
                props: {
                  experiences: state.components
                    .find((comp) => comp.type === 'experiences')
                    ?.props.experiences.map((exp: any) =>
                      exp.id === action.experience.id ? action.experience : exp
                    ),
                },
              }
        ),
      }

    case DELETE_EXPERIENCE:
      return {
        ...state,
        components: state.components.map((comp) =>
          comp.type !== 'experiences'
            ? comp
            : {
                ...state.components.find((comp) => comp.type === 'experiences'),
                props: {
                  experiences: state.components
                    .find((comp) => comp.type === 'experiences')
                    ?.props.experiences.filter(
                      (exp: any) => exp.id !== action.experience.id
                    ),
                },
              }
        ),
      }

    case UPDATE_EDUCATION:
      return {
        ...state,
        components: state.components.map((comp) =>
          comp.type !== 'education'
            ? comp
            : {
                ...state.components.find((comp) => comp.type === 'education'),
                props: {
                  education: state.components
                    .find((comp) => comp.type === 'education')
                    ?.props.education.map((edu: any) =>
                      edu.id === action.education.id ? action.education : edu
                    ),
                },
              }
        ),
      }

    case DELETE_EDUCATION:
      return {
        ...state,
        components: state.components.map((comp) =>
          comp.type !== 'education'
            ? comp
            : {
                ...state.components.find((comp) => comp.type === 'education'),
                props: {
                  education: state.components
                    .find((comp) => comp.type === 'education')
                    ?.props.education.filter(
                      (edu: any) => edu.id !== action.education.id
                    ),
                },
              }
        ),
      }

    case DELETE_BOOK_BY_ID:
      return {
        ...state,
        components: state.components.map((comp) =>
          comp.type !== 'bookshelf'
            ? comp
            : {
                ...state.components.find((comp) => comp.type === 'bookshelf'),
                props: {
                  books: state.components
                    .find((comp) => comp.type === 'bookshelf')
                    ?.props.books.filter((book: any) => book.id !== action.id),
                },
              }
        ),
      }

    case DELETE_INTEGRATION:
      return {
        ...state,
        components: state.components.map((comp) =>
          comp.type !== 'integrations'
            ? comp
            : {
                ...state.components.find(
                  (comp) => comp.type === 'integrations'
                ),
                props: {
                  integrations: state.components
                    .find((comp) => comp.type === 'integrations')
                    ?.props.integrations.filter(
                      (integration: any) => integration.id !== action.id
                    ),
                },
              }
        ),
      }

    default:
      return state
  }
}

export const ProfileProvider: React.FC = ({ children }) => {
  const [profileState, profileDispatch] = useReducer(
    ProfileReducer,
    initialState
  )

  return (
    <ProfileContext.Provider value={{ profileState, profileDispatch }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfileContext = () => {
  return useContext(ProfileContext)
}
