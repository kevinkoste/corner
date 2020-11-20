import styles from './Base.module.css'

import BeatLoader from 'react-spinners/BeatLoader'

export const Page: React.FC = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}

export const Loader: React.FC = () => {
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
