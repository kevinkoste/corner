import "../styles/globals.css";

// import { AppProvider } from './context/AppContext'
// import { AppNavigator } from './pages/AppNavigator'

import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps}></Component>;
}

export default App;
