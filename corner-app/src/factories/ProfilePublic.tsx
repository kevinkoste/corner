import React from 'react'

import { Component } from '../models/Profile'
import { Bio } from '../components/profile/Bio'
import { Title } from '../components/profile/Title'
import { Image } from '../components/profile/Image'

// import { Experiences } from './Experiences'
// import { Bookshelf } from './Bookshelf'

// GenerateComponent takes JSON {id, component, props},
// then generates a React element
// The value of component.type maps to one of the components imported above
// id, key, and profile are injected as props to each component
type ComponentIndex = {
  [index: string]: any
}
const Components: ComponentIndex = {
  bio: Bio,
  headline: Title,
  headshot: Image,
  // experiences: Experiences,
  // bookshelf: Bookshelf,
}

export const GenerateComponent = (component: Component, name: string) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {
    // console.log('generating ', component.type, ' with: ', {
    //   ...component,
    //   key: component.id,
    //   name: name,
    // })
    return React.createElement(Components[component.type], {
      ...component,
      key: component.id,
      name: name,
    })
  }
  // component does not exist
  return <React.Fragment key={component.id} />
}
