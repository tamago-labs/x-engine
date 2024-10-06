import { useState, useEffect, useContext } from "react"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

import AOS from 'aos';
import 'aos/dist/aos.css';

import { LayoutContext } from "@/hooks/useLayout";
import { AuthContext } from "@/hooks/useAuth";

const MainLayout = ({ children }) => {

    const [showLoader, setShowLoader] = useState(true); 
    const { checkSession } = useContext(AuthContext)

    useEffect(() => {

        const screenLoader = document.getElementsByClassName('screen_loader');
        if (screenLoader?.length) {
            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }

    });

    useEffect(() => {
        AOS.init({
            once: true,
        });
    }, []);

    useEffect(() => {
        !showLoader && checkSession()
    }, [showLoader])

    return (
        <>
            {/* screen loader  */}
            {showLoader && (
                <div className="screen_loader fixed inset-0 z-[60] grid place-content-center bg-neutral-800">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="200px"
                        height="200px"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid"
                    >
                        <circle cx="50" cy="50" r="0" fill="none" stroke="#2563eb" strokeWidth="4">
                            <animate
                                attributeName="r"
                                repeatCount="indefinite"
                                dur="1s"
                                values="0;16"
                                keyTimes="0;1"
                                keySplines="0 0.2 0.8 1"
                                calcMode="spline"
                                begin="0s"
                            ></animate>
                            <animate
                                attributeName="opacity"
                                repeatCount="indefinite"
                                dur="1s"
                                values="1;0"
                                keyTimes="0;1"
                                keySplines="0.2 0 0.8 1"
                                calcMode="spline"
                                begin="0s"
                            ></animate>
                        </circle>
                    </svg>
                </div>
            )}

            <div className='flex min-h-screen flex-col bg-neutral-800 text-base font-normal text-gray antialiased font-mono '>
                <div className="-mt-[29px] flex-glow overflow-x-hidden flex flex-row">
                    <aside className=" bg-neutral-800 text-white w-[60px] flex flex-col min-h-screen   border-r border-neutral-600  ">
                        <Navbar />
                    </aside>
                    <div className=" flex-grow overflow-x-hidden">
                        {children}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}



export default MainLayout