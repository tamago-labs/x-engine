
import { useState } from "react";
import BaseModal from "./base";


const HelpModal = ({ visible, close }) => {


    const [toggle, setToggle] = useState(true)



    return (
        <BaseModal
            visible={visible}
            close={close}
            maxWidth="max-w-lg"
        >
            <div className="flex flex-col  "> 
                <div>
                    <img src="/assets/welcome.svg" className={`w-[40%] mx-auto transition duration-500 -rotate-3 hover:rotate-3 `} />
                </div> 
                <h2 className="text-center text-xl w-[300px] mx-auto font-semibold mt-6 ">Welcome to X-Engine!</h2>
                <div className='my-4 border-neutral-600 border-t pt-4 flex text-sm sm:text-base px-0 sm:px-2 text-gray-100 '>
                    <div className="w-full max-w-[420px] mx-auto">
                        <li>Now featuring gas optimization and vulnerability detection with AI for Move contracts. </li>
                        <li>Reviews are processed in batches to help reduce costs.</li>
                        <li>Each user receives 30 © and 10 © daily after.</li>
                    </div>
                </div>
            </div> 
            <button onClick={close} class={`bg-white text-center mt-2  text-black  mx-auto py-2   w-full   rounded `}>
                Close
            </button>
        </BaseModal>
    )
}

export default HelpModal