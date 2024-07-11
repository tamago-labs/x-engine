import "@/styles/globals.css";

import AccountProvider from "../hooks/useAccount"

export default function App({ Component, pageProps }) {
  return (
    <AccountProvider>
      <Component {...pageProps} />
    </AccountProvider>
  )
}
