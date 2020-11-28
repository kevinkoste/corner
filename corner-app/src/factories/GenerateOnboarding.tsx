import React from 'react'

import { Username } from '../components/onboarding/Username'

// GenerateOnboardingComponent takes JSON {id, component, props},
// then generates a React element
// The value of component.type maps to one of the components imported above
// id, key, and profile are injected as props to each component
type ComponentIndex = {
  [index: string]: any
}
const Components: ComponentIndex = {
  username: Username,
  // name: OnboardingName,
  // headline: OnboardingHeadline,
  // headshot: OnboardingHeadshot,
  // done: OnboardingDone,
}
export const GenerateOnboardingComponent = (
  component: any,
  onForwardClick: any,
  setShowButton: any
) => {
  // component exists
  if (typeof Components[component.type] !== 'undefined') {
    return React.createElement(Components[component.type], {
      ...component?.props,
      id: component.id,
      key: component.id,
      onForwardClick: onForwardClick,
      setShowButton: setShowButton,
    })
  }
  // component does not exist
  return <React.Fragment key={component.id} />
}
