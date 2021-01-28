import React from 'react'

import { Component } from '../models/profile'
import { EditBio } from '../components/profile/Bio'
import { EditTitle } from '../components/profile/Title'
import { EditImage } from '../components/profile/Image'
import { EditExperience } from '../components/profile/Experience'
import { EditEducation } from '../components/profile/Education'
import { EditBookshelf } from '../components/profile/Bookshelf'
import { EditTwitter } from '../components/profile/Twitter'

// GenerateComponent takes JSON {id, component, props},
// then generates a React element
// The value of component.type maps to one of the components imported above
// id, key, and profile are injected as props to each component
type ComponentIndex = {
  [index: string]: any
}
const Components: ComponentIndex = {
  bio: EditBio,
  headline: EditTitle,
  headshot: EditImage,
  experiences: EditExperience,
  education: EditEducation,
  bookshelf: EditBookshelf,
  twitter: EditTwitter,
}

export const GenerateEditComponent = (component: Component, name: string) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {
    return React.createElement(Components[component.type], {
      ...component,
      key: component.id,
      name: name,
    })
  }
  // component does not exist
  return <React.Fragment key={component.id} />
}
