import { useRouter } from 'next/router'
import { useState } from 'react'

import { useAppContext, setAuth } from '../context/AppContext'
import { PostProtectInviteNewEmail, PostAuthLogout } from '../libs/api'

import styles from './Header.module.css'

const Header: React.FC<{ title: string }> = ({ title }) => {
  const router = useRouter()
  const { state, dispatch } = useAppContext()
  const [showingBurger, setShowingBurger] = useState(false)

  const toggleBurger = () => setShowingBurger(!showingBurger)

  const takeHome = () => {
    if (state.auth) {
      router.push('/browse')
    } else {
      router.push('/')
    }
  }

  const handleLogOut = async () => {
    await PostAuthLogout()
    dispatch(setAuth(false))
    toggleBurger()
    router.push('/')
  }

  if (!showingBurger) {
    return (
      <div className={styles.headerWrapper}>
        <div className={styles.headerContainer}>
          <h1 className={styles.animatedName} onClick={takeHome}>
            Corner
          </h1>
          <h1 className={styles.animatedTitle} onClick={takeHome}>
            {title}
          </h1>

          <img
            className={styles.burgerButton}
            onClick={toggleBurger}
            src="/icons/burger.svg"
            alt="burger button"
          />
        </div>
      </div>
    )
  }
  return (
    <div className={styles.menuContainer}>
      <div
        className={styles.headerWrapper}
        style={{ backgroundColor: '#000000' }}
      >
        <div
          className={styles.headerContainer}
          style={{ borderColor: '#ffffff' }}
        >
          <h1 style={{ color: 'white' }}>Corner</h1>
          <img
            className={styles.exitButton}
            onClick={toggleBurger}
            src="/icons/exit.png"
            alt="exit burger button"
          />
        </div>
      </div>

      <div className={styles.menuBody}>
        <h1
          onClick={() => {
            router.push(`/browse`)
            toggleBurger()
          }}
        >
          Browse Profiles
        </h1>

        {!state.onboarded && !state.auth && (
          <h1
            onClick={() => {
              router.push(`/login`)
              toggleBurger()
            }}
          >
            Join Corner
          </h1>
        )}

        {!state.onboarded && state.auth && (
          <h1
            onClick={() => {
              router.push(`/onboarding`)
              toggleBurger()
            }}
          >
            Make Your Profile
          </h1>
        )}

        {state.onboarded && state.auth && (
          <h1
            onClick={() => {
              router.push(`/edit/${state.username}`)
              toggleBurger()
            }}
          >
            My Profile
          </h1>
        )}

        {state.auth && <h1 onClick={handleLogOut}>Log Out</h1>}

        {/* <InviteForm /> */}
      </div>
    </div>
  )
}

export default Header

// const InviteForm: React.FC = () => {
//   const [sent, setSent] = useState(false)
//   const [emailInput, setEmailInput] = useState('')

//   const onSubmit = () => {
//     setSent(true)

//     PostProtectInviteNewEmail(emailInput)
//       .then((res) => {
//         console.log(res)
//       })
//       .catch((err) => console.log(err))
//   }

//   return (
//     <Div column width={12}>
//       <HeaderTitleText style={{ color: 'white', marginTop: '60px' }}>
//         Invite a friend
//       </HeaderTitleText>

//       {!sent && (
//         <Div row width={12} style={{ position: 'relative', maxWidth: '400px' }}>
//           <InviteTextInput
//             placeholder={'yourfriend@gmail.com'}
//             onChange={(event: any) => setEmailInput(event.target.value)}
//             value={emailInput}
//             autoCapitalize="none"
//           />
//           <InviteButton onClick={onSubmit}>Invite &#62;</InviteButton>
//         </Div>
//       )}

//       {sent && (
//         <Div row width={12} style={{ position: 'relative', maxWidth: '400px' }}>
//           <InvitedText>{emailInput} has been invited!</InvitedText>
//         </Div>
//       )}
//     </Div>
//   )
// }
