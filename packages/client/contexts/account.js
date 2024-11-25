import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { usePathname, useRouter } from "next/navigation";
import {
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
} from "@mysten/sui/client";
import { useCurrentAccount, useCurrentWallet, useDisconnectWallet, useSignTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useEnokiFlow, useZkLogin, useZkLoginSession } from "@mysten/enoki/react";
import { fromB64, toB64 } from "@mysten/sui/utils";
import axios, { AxiosResponse } from "axios";
// import { useAuthentication } from "./Authentication";
// import { UserRole } from "@/types/Authentication";
import { jwtDecode } from "jwt-decode";

export const AccountContext = createContext({})

const Provider = ({ children }) => {

  const client = useSuiClient()

  const router = useRouter();
  const pathname = usePathname();
  const enokiFlow = useEnokiFlow();
  const { address } = useZkLogin();
  const zkLoginSession = useZkLoginSession();

  const [values, dispatch] = useReducer(
    (curVal, newVal) => ({ ...curVal, ...newVal }),
    {
      user: undefined,
      emailAddress: undefined,
      loading: true
    }
  )

  const { user } = values

  const isConnected = !!address

  const handleLoginAs = useCallback(
    (newUser) => {
      dispatch({ user: newUser });
      sessionStorage.setItem("user", JSON.stringify(newUser));
      sessionStorage.setItem("userRole", newUser.role);
      if (pathname === "/" || pathname === "/auth") {
        if (newUser.role === "anonymous" || !newUser.role) {
          router.push("/");
        } else {
          router.push("/");
        }
      }
    },
    [router, pathname]
  );

  useEffect(() => {
    const initialUser = sessionStorage.getItem("user");
    if (initialUser) {
      const parsedUser = JSON.parse(initialUser);
      handleLoginAs(parsedUser);
    } else {
      dispatch({ user: undefined, emailAddress: undefined });
    }
    dispatch({
      loading: false
    });
  }, [handleLoginAs, router]);

  const handleLogout = () => {
    dispatch({ user: undefined, emailAddress: undefined });
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userRole");
    enokiFlow.logout();
    sessionStorage.clear();
    router.push("/");
  };

  const redirectToAuthUrl = () => {
    router.push("/auth");

    const protocol = window.location.protocol;
    const host = window.location.host;
    const customRedirectUri = `${protocol}//${host}/auth`;

    enokiFlow
      .createAuthorizationURL({
        provider: "google",
        network: "testnet",
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUrl: customRedirectUri,
        extraParams: {
          scope: ["openid", "email", "profile",],
        },
      })
      .then((url) => {
        router.push(url);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getBalance = useCallback(async () => {

    if (!address) {
      return 0
    }

    const output = await client.getBalance({
      owner: address,
      coinType: "0x2::sui::SUI"
    })

    const { totalBalance } = output
    return (Number(totalBalance) / 10 ** 9)
  },[address])

  useEffect(() => {

    if (isConnected && zkLoginSession && zkLoginSession.jwt) {
      const token = zkLoginSession.jwt;
      const decoded = jwtDecode(token);

      dispatch({
        emailAddress: (decoded).email
      })

      handleLoginAs({
        firstName: "Wallet",
        lastName: "User",
        role:
          sessionStorage.getItem("userRole") !== "null"
            ? (sessionStorage.getItem("userRole"))
            : "anonymous",
        email: (decoded).email,
        picture: "",
      });
    }

  }, [isConnected, handleLoginAs, zkLoginSession])

  const accountContext = useMemo(
    () => ({
      redirectToAuthUrl,
      isConnected,
      logout: () => {
        handleLogout()
      },
      user,
      address,
      getBalance
    }), [
    isConnected,
    user,
    address,
    getBalance
  ])

  return (
    <AccountContext.Provider value={accountContext}>
      {children}
    </AccountContext.Provider>
  )
}

export default Provider