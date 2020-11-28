export type OnboardingProps = {
  onboardingData: {
    username: string
    name: string
    title: string
    image: string
  }
  setOnboardingData: Function
  canContinue: boolean
  setCanContinue: Function
  onForwardClick: Function
}
