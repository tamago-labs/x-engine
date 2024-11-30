
import AnimateHeight from 'react-animate-height'
import { ChevronDown, ChevronUp } from 'react-feather'

export const AccordianItem = ({ onOpen, showPanel, title, children }) => {

    return (
        <div className="my-2">
            <div onClick={onOpen} className={` rounded-t-lg ${!showPanel && " rounded-b-lg"} border border-transparent cursor-pointer `} >
                <div className='grid grid-cols-7 h-full'>
                    <div className="col-span-5  text-sm mt-2 mb-2 font-semibold ">
                        {title}
                    </div>
                    <div className="col-span-2 flex pr-2 text-white">
                        <div className='m-auto mr-0'>
                            {!showPanel
                                ?
                                <ChevronDown />
                                :
                                <ChevronUp />}
                        </div>
                    </div>
                </div>
            </div>

            <AnimateHeight duration={600} height={showPanel ? 'auto' : 0}>
                <div className='mr-2'>
                    {children}
                </div>

            </AnimateHeight>
        </div>
    )
}