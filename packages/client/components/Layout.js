import Link from "next/link"
import { MessageSquare, FileText, Server, Home, Settings, GitHub, Code, Book, BookOpen, List, Edit } from "react-feather"
import { useRouter } from "next/router"
import Footer from "./Footer"

const Layout = ({ children }) => {

    const router = useRouter()

    console.log("router path ", router.pathname)

    return (
        <div>
            <div className='flex min-h-screen flex-col bg-neutral-800 text-base font-normal text-gray antialiased  '>
                <div className="-mt-[28px] flex-glow overflow-x-hidden flex flex-row">
                    <aside className=" bg-neutral-800 text-white w-[60px] flex flex-col min-h-screen   border-r border-neutral-600  ">
                        <nav className="h-full pt-[28px] flex flex-col">
                            <ul className="space-y-2  ">
                                <li className={`${router.pathname === "/" ? "bg-neutral-700 border-blue-600 border-l-4" : " border-transparent border-l-4"} `}>
                                    <Link href="/">
                                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer">
                                            <div className={`flex items-center justify-center ${router.pathname === "/" ? "opacity-100" : "opacity-60"} hover:opacity-100`}>
                                                <Edit size={24} />
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                            <ul className=" h-full flex flex-col">
                                <li className="mt-auto mx-auto">
                                    <Link href="/">
                                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer border-transparent border-l-4">
                                            <div className={`flex items-center justify-center opacity-60  `}>
                                                <GitHub size={24} />
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className=" mx-auto mb-1.5">
                                    <Link href="/">
                                        <div className="mx-auto py-3 justify-between p-2 cursor-pointer border-transparent border-l-4">
                                            <div className={`flex items-center justify-center opacity-60  `}>
                                                <Settings size={24} />
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                    <div className=" flex-grow overflow-x-hidden">{children}</div>
                </div>
                <Footer />



            </div>
        </div>
    )
}

export default Layout