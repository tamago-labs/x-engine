
import { shortAddress } from "@/helpers"
import { useCallback, useContext, useEffect } from "react"
import { X } from "react-feather"
import Markdown from 'react-markdown'
import Editor from '@monaco-editor/react';
import { AccountContext } from "@/hooks/useAccount";

const filterArray = (input) => {

    if (input.indexOf("[") !== -1 && input.indexOf("]") !== -1) {
        input = (input.split("[")[1]).split("]")[1]
    }

    return input
}

const Scores = ({ value }) => {

    let cards = []

    if (value.indexOf("[") !== -1 && value.indexOf("]") !== -1) {

        try {
            const arr = value.substring(value.indexOf("["), value.indexOf("]") + 1).replaceAll("%", "")
            const json = JSON.parse(arr)
            cards = [json.reduce((out, item) => {
                return out + item
            }, 0) / json.length]
        } catch (e) {

        }

    }

    return <div className="flex flex-row space-x-2">
        {cards.map((item, index) => {
            return (
                <div key={index} className="  group my-4 mt-2 px-4 py-4 text-sm flex flex-row  space-x-5  border border-neutral-600   ">

                    <h3 className="my-auto">Vulnerability Score:</h3>
                    <h1 className="text-2xl my-auto  font-bold">
                        {`${item.toFixed(0)}%`}
                    </h1>
                </div >
            )
        })

        }
    </div>
}

const MarkdownDisplay = ({ content, setSelect, close }) => {

    const { saveFile } = useContext(AccountContext)

    const onSave = useCallback((value, event) => {

        if (content.editable) {
            const file_name = content.name
            const project_name = content.project_name
            saveFile(content, setSelect, project_name, file_name, value)
        }

    }, [content, saveFile])

    return (
        <>
            <div className='flex flex-col h-full overflow-y-auto text-[#D4D4D4] '>
                <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                    {content && (
                        <div className='bg-[#1E1E1E] text-[#D4D4D4] font-mono px-4 flex border-neutral-600 border-r '>
                            <div className='m-auto'>
                                {content && content.source_code === false && (content.title)}
                                {content && content.source_code === true && `${content.name}`}
                            </div>
                            <div onClick={close} className='m-auto'>
                                <X size={16} className='ml-1.5 mb-0.5 cursor-pointer' />
                            </div>
                        </div>
                    )}
                </div>

                {(content && content.source_code === false)
                    &&
                    <div className="p-4">
                        <Scores value={content.value} />
                        <Markdown>
                            {filterArray(content.value)}
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

                {(content && content.source_code === true)
                    &&
                    <div>
                        <Editor
                            height="100vh"
                            theme="vs-dark"
                            path={content.name}
                            defaultLanguage={"rust"}
                            defaultValue={content.value}
                            onChange={onSave}
                        />
                    </div>
                }

            </div>

        </>
    )
}

export default MarkdownDisplay