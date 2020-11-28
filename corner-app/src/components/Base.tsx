import styles from './Base.module.css'

import { useState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'

export const Page = ({ children, ...props }) => {
  return (
    <div className={styles.page} {...props}>
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

export const Loader = () => {
  return (
    <BeatLoader
      css={
        'height: 24px; width: 72px; overflow: auto; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0;'
      }
      size={20}
      loading={true}
      color={'#000000'}
    />
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

// export const Footer = () => {
//   return (
//     <footer className={styles.footer}>
//       <div>
//         <img
//           src="/icons/Headshot.png"
//           alt="Headshot"
//           className={styles.headshot}
//           height="60px"
//           width="60px"
//         />
//         <p>
//           © Kevin Koste<br></br>2020 🚀
//         </p>
//       </div>
//       <div>
//         <a
//           href="https://github.com/kevinkoste"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <img
//             src="/icons/Github.svg"
//             alt="GitHub Logo"
//             className={styles.logo}
//             height="30px"
//             width="30px"
//           />
//         </a>
//         <a
//           href="https://linkedin.com/in/kevinkoste"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <img
//             src="/icons/Linkedin.svg"
//             alt="LinkedIn Logo"
//             className={styles.logo}
//             height="30px"
//             width="30px"
//           />
//         </a>
//         <a
//           href="mailto:kevinkoste@gmail.com"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <img
//             src="/icons/Mail.svg"
//             alt="Email Logo"
//             className={styles.logo}
//             height="30px"
//             width="30px"
//           />
//         </a>
//       </div>
//     </footer>
//   )
// }
