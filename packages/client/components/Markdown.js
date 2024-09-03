
import { slugify } from "@/helpers"
import { useEffect } from "react"
import { X } from "react-feather"
import Markdown from 'react-markdown'

const MarkdownDisplay = ({ content, close }) => {


    return (
        <>
            <div className='flex flex-col h-full overflow-y-auto text-[#D4D4D4] '>
                <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                    {content && (
                        <div className='bg-[#1E1E1E] text-[#D4D4D4] font-mono px-4 flex border-neutral-600 border-r '>
                            <div className='m-auto'>
                                {content && slugify(content.split("#")[1].split("\n")[0])}
                            </div>
                            <div onClick={close} className='m-auto'>
                                <X size={16} className='ml-1.5 mb-0.5 cursor-pointer' />
                            </div>
                        </div>
                    )}
                </div>

                {content
                    &&
                    <div className="p-4">
                        <Markdown>
                            {content}
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