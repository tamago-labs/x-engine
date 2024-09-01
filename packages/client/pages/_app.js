import "@/styles/globals.css";

import AccountProvider from "../hooks/useAccount"
import ModalProvider from "../hooks/useModal"
import LayoutProvider from "../hooks/useLayout"

import AuthProvider from "../hooks/useAuth"

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AccountProvider>
        <LayoutProvider>
          <ModalProvider>
            <Component {...pageProps} />
          </ModalProvider>
        </LayoutProvider>
      </AccountProvider>
    </AuthProvider>
  )
}
