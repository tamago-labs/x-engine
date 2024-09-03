

import { useCallback, useState, useReducer, useContext } from "react";
import BaseModal from "./base";
import { AuthContext } from "@/hooks/useAuth";

const AuthModal = ({ visible, close }) => {

    const { signIn, logIn } = useContext(AuthContext)

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            tab: 1,
            username: undefined,
            password: undefined,
            passwordRetry: undefined,
            errorMessage: undefined
        }
    )

    const { tab, username, password, passwordRetry, errorMessage } = values

    const onLogin = useCallback(async () => {

        dispatch({ errorMessage: undefined })

        if (username == undefined) {
            dispatch({ errorMessage: "Email is empty" })
            return
        }

        if (password == undefined) {
            dispatch({ errorMessage: "Password is empty" })
            return
        }

        try {
            await logIn(username, password)
            
        } catch (e) {
            const errorMessage = e && e.message ? e.message : "Unknown Error"
            dispatch({ errorMessage })
        }

    }, [username, password])

    const onSignIn = useCallback(async () => {

        dispatch({ errorMessage: undefined })

        if (username == undefined) {
            dispatch({ errorMessage: "Email is empty" })
            return
        }

        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/.test(username) === false) {
            dispatch({ errorMessage: "Invalid email format" })
            return
        }

        if (password == undefined && passwordRetry == undefined) {
            dispatch({ errorMessage: "Password is empty" })
            return
        }

        if (password !== passwordRetry) {
            dispatch({ errorMessage: "Password does not match" })
            return
        }

        if (!/^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(password)) {
            dispatch({ errorMessage: "Password should have at least eight characters, including at least one letter and one number" })
            return
        }

        try {
            await signIn(username, password)
            dispatch({ errorMessage: "Your account has been created successfully" })
        } catch (e) {
            const errorMessage = e.message === "Document update conflict" ? "The email is already registered" : e.message
            dispatch({ errorMessage })
        }

    }, [username, password, passwordRetry])



    return (
        <BaseModal
            visible={visible}
            close={close}
            maxWidth="max-w-md"
        >

            <div className="w-[200px] mx-auto my-4">
                <img
                    className="h-full w-full object-contain object-center rounded-full"
                    src={"/assets/tamago-labs-logo.png"}
                    alt=""
                />
            </div>

            <div className="mt-[20px] gap-3 grid grid-cols-2 text-center text-lg font-semibold">
                <div onClick={() => dispatch({
                    tab: 1,
                    username: undefined,
                    password: undefined,
                    passwordRetry: undefined,
                    errorMessage: undefined
                })} className={`p-1 cursor-pointer ${tab === 1 && "border-blue-600 border-b-4"}`}>
                    Login
                </div>
                <div onClick={() => dispatch({
                    tab: 2,
                    username: undefined,
                    password: undefined,
                    passwordRetry: undefined,
                    errorMessage: undefined
                })} className={`p-1  cursor-pointer ${tab === 2 && "border-blue-600 border-b-4"}`}>
                    Sign In
                </div>
            </div>
            <div className="h-[20px]">

            </div>

            {tab === 1 && (
                <div>
                    <div class="mb-4 px-6 font-mono mt-4 grid grid-cols-3">
                        <label for="username" class="block text-white text-sm font-bold text-right pr-2 pt-2">Your Email:</label>
                        <input value={username} onChange={(e) => dispatch({ username: e.target.value })} type="text" id="username" name="username" className="shadow col-span-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div class="mb-4 px-6 font-mono mt-4 grid grid-cols-3">
                        <label for="password" class="block text-white text-sm font-bold text-right pr-2 pt-2 mb-2">Password:</label>
                        <input value={password} onChange={(e) => dispatch({ password: e.target.value })} type="password" id="password" name="password" className="shadow col-span-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div class="mb-4 px-6 font-mono mt-6 flex ">
                        
                        <button onClick={onLogin} class={`bg-white  mx-auto col-span-2  text-sm w-[150px]   text-black font-bold py-2 rounded-md `}>
                            Login
                        </button>
                    </div>
                </div>
            )}
            {tab === 2 && (
                <div>
                    <div class="mb-4 px-6 font-mono mt-4 grid grid-cols-5">
                        <label for="username" class="block text-white text-sm font-bold text-right pr-2  col-span-2 pt-2">Your Email:</label>
                        <input value={username} onChange={(e) => dispatch({ username: e.target.value })} type="text" id="username" name="username" className="shadow col-span-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div class="mb-4 px-6 font-mono mt-4 grid grid-cols-5">
                        <label for="password" class="block text-white text-sm font-bold text-right pr-2 pt-2 col-span-2 mb-2">Password:</label>
                        <input value={password} onChange={(e) => dispatch({ password: e.target.value })} type="password" id="password" name="password" className="shadow col-span-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div class="mb-4 px-6  font-mono mt-4 grid grid-cols-5">
                        <label for="passwordRetry" class="block text-white text-sm font-bold text-right pr-2 pt-2 col-span-2 mb-2">Password Again:</label>
                        <input value={passwordRetry} onChange={(e) => dispatch({ passwordRetry: e.target.value })} type="password" id="passwordRetry" name="passwordRetry" className="shadow col-span-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div class="mb-4 px-6 font-mono mt-6 flex ">
                       
                        <button onClick={onSignIn} class={`bg-white mx-auto col-span-3  text-sm w-[150px]   text-black font-bold py-2 rounded-md `}>
                            Sign In
                        </button>
                    </div>
                </div>
            )}
            {errorMessage ? (
                <div className="text-sm p-2 text-center text-yellow-400">
                    {errorMessage}
                </div>
            ) : (
                <div className="px-2 mt-4 text-center text-xs">
                    The preview version is free to use. New users will receive 30 credits and 5 free credits can be claimed each day
                </div>
            )}


        </BaseModal>
    )
}

export default AuthModal