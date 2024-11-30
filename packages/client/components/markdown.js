import { X } from "react-feather"
import Markdown from 'react-markdown'
import { useCallback, useContext, useEffect, useState } from "react"
import axios from "axios";

const filterArray = (input) => {

    if (input.indexOf("[") !== -1 && input.indexOf("]") !== -1) {
        input = (input.split("[")[1]).split("]")[1]
    }

    return input
}


const MarkdownDisplay = ({ content, setSelect, close }) => {

    const [data, setData] = useState()

    useEffect(() => {

        if (content && content.source_code === false) {
            axios.get(content.value).then(
                ({ data }) => {
                    setData(data)
                }
            )
        } else {
            setData(undefined)
        }

    }, [content])

    return (
        <>
            <div className='flex flex-col h-full  text-[#D4D4D4] '>
                <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                    {content && (
                        <div className='bg-[#1E1E1E] text-[#D4D4D4] font-mono px-4 flex border-neutral-600 border-r '>
                            <div className='m-auto'>
                                {content && content.source_code === false && ((content.value).split("context/")[1])}
                                {content && content.source_code === true && `${content.name}`}
                            </div>
                            <div onClick={close} className='m-auto'>
                                <X size={16} className='ml-1.5 mb-0.5 cursor-pointer' />
                            </div>
                        </div>
                    )}
                </div>

                {(content && content.source_code === false && data)
                    &&
                    <div className="p-4 overflow-y-auto max-h-[90vh]"> 
                        <Markdown>
                            {filterArray(data)}
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

            </div>
        </>
    )
}

export default MarkdownDisplay