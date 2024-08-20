import "@/styles/globals.css";

import AccountProvider from "../hooks/useAccount"
import ModalProvider from "../hooks/useModal"
import LayoutProvider from "../hooks/useLayout"



export default function App({ Component, pageProps }) {
  return (
    <AccountProvider>
      <LayoutProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </LayoutProvider>
    </AccountProvider>
  )
}
