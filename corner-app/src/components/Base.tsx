import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './Base.module.css'

export const Page = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}

// export const Header = () => {
//   const router = useRouter()
//   return (
//     <header className={styles.header}>
//       <Link href="/">
//         <a>Kevin Koste</a>
//       </Link>
//       <div className={styles.navbar}>
//         {['work', 'blog'].map((value, idx) => (
//           <Link href={`/${value}`} key={idx}>
//             <a
//               style={{
//                 borderBottom: router.pathname.startsWith(`/${value}`)
//                   ? '1px solid'
//                   : '',
//               }}
//             >
//               {value}
//             </a>
//           </Link>
//         ))}
//       </div>
//     </header>
//   )
// }

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
