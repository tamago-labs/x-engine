import { AccountContext } from '@/hooks/useAccount';
import Editor from '@monaco-editor/react';
import { ArrowRight, X } from "react-feather"
import { useCallback, useContext, useEffect, useState } from 'react';
import WalletConnect from './WalletConnect';
import WalletHeader from './WalletHeader';

const SourceCode = () => {

    const { selected, select, openReport, isOpen, report, saveFile } = useContext(AccountContext)

    // useEffect(() => {
    //     loadProfile()
    // }, [])

    const onSave = useCallback((value, event) => {

        if (selected.editable) {

            const file_name = selected.name
            const project_name = selected.project_name

            saveFile(project_name, file_name, value)

        }

    }, [selected, saveFile])

    return (
        <>
            <div className='flex flex-col h-full text-[#D4D4D4] '>
                <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                    {selected && (
                        <div className='bg-[#1E1E1E] text-[#D4D4D4] font-mono px-4 flex border-neutral-600 border-r '>
                            <div className='m-auto'>
                                {selected.name}
                            </div>
                            <div onClick={() => select(undefined)} className='m-auto'>
                                <X size={16} className='ml-1.5 mb-0.5 cursor-pointer' />
                            </div>
                        </div>
                    )} 
                    <WalletHeader/>

                </div>

                {selected
                    ?
                    <Editor
                        height="80vh"
                        theme="vs-dark"
                        path={selected.name}
                        defaultLanguage={"rust"}
                        defaultValue={selected.value}
                        onChange={onSave}
                    />
                    :
                    <div className='h-[80vh]'>
                    </div>
                }
                <div className='flex-grow border-neutral-600 border-t font-mono p-4 flex text-sm'>
                    <div className='my-auto'>
                        <li>Welcome to XReview, an AI code review tool for Move contracts.</li>
                        <li>This is an early preview version and may contain bugs or incomplete features. </li>
                        <li>Each user can submit up to 3 code review requests per day.</li>
                        <li>If you need to submit more than the limit, you will need to buy additional credits.</li>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SourceCode