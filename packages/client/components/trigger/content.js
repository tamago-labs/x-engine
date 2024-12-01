
import { X } from "react-feather"
import Markdown from 'react-markdown'
import { GrTrigger } from "react-icons/gr";


const Content = ({
    selected,
    setSelect,
    openModal
}) => {
    return (
        <div className='flex flex-col h-full  text-[#D4D4D4] '>
            <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                {selected && (
                    <div className='bg-[#1E1E1E] text-[#D4D4D4] font-mono px-4 flex border-neutral-600 border-r '>
                        <div className='m-auto'>
                            {selected.title}
                        </div>
                        <div onClick={() => setSelect(undefined)} className='m-auto'>
                            <X size={16} className='ml-1.5 mb-0.5 cursor-pointer' />
                        </div>
                    </div>
                )}
            </div>

            {selected
                &&
                <div className=" p-4 overflow-y-auto h-[90vh] border-b border-neutral-600">
                    <Markdown>
                        {(selected.value)}
                    </Markdown>
                    <style>
                        {`
                    h2 {
                        font-size: 24px;
                        font-weight: 600;
                        margin-top: 20px;
                        margin-bottom: 20px;
                    }
                    h1 {
                        font-size: 32px;
                        font-weight: 600;
                        margin-top: 20px;
                        margin-bottom: 20px;
                    }
                    p {
                        margin-top: 5px;
                    }
                `}
                    </style>
                </div>
            }

            <div className="absolute bottom-[80px] right-[60px]">
                <button disabled={!selected} onClick={openModal}
                    className={` w-full justify-center gap-x-1.5 rounded-full bg-white px-6 py-1.5  font-semibold text-gray-900 shadow-sm flex flex-row ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${!selected && "opacity-60"} `}>
                    <GrTrigger  className="my-auto" />
                    <div className="my-auto">
                        Actions
                    </div>
                </button>
            </div>

        </div>

    )
}

export default Content