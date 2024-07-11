import { AccountContext } from '@/hooks/useAccount';
import Editor from '@monaco-editor/react';
import { X } from "react-feather"
import { useContext, useState } from 'react';

const files = {
    'script.js': {
        name: 'script.js',
        language: 'rust',
        value: `
module sui_example::sui_hello_world {

    use std::string;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct HelloWorldObject has key, store {
        id: UID,
        text: string::String
    }

    public entry fun mint(ctx: &mut TxContext) {
        let object = HelloWorldObject {
            id: object::new(ctx),
            text: string::utf8(b"Hello World!")
        };
        transfer::public_transfer(object, tx_context::sender(ctx));
    }

}
`,
    },
    'style.css': {
        name: 'style.css',
        language: 'css',
        value: `
border: 10px;
      `,
    },
    'index.html': {
        name: 'index.html',
        language: 'html',
        value: `
<div>
    hello from here
</div>
      `,
    },
};

const SourceCode = () => {

    const { selected, select } = useContext(AccountContext)

    const [fileName, setFileName] = useState('script.js');

    const file = files[fileName];

    return (
        <div className='flex flex-col h-full text-[#D4D4D4] '>
            <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                {selected && (
                    <div className='bg-[#1E1E1E] text-[#D4D4D4] font-mono px-4 flex border-neutral-600 border-r '>
                        <div className='m-auto'>
                            {selected.name}
                        </div>
                        <div onClick={() => select(undefined)} className='m-auto'>
                            <X size={16} className='ml-1.5 mb-0.5 cursor-pointer'/>
                        </div>
                    </div>
                )}
            </div>

            {selected
                ?
                <Editor
                    height="80vh"
                    theme="vs-dark"
                    path={file.name}
                    defaultLanguage={file.language}
                    defaultValue={file.value}
                />
                :
                <div className='h-[80vh]'>
                </div>
            }


            <div className='  flex-grow border-neutral-600 border-t'>
                hello
            </div>

        </div>
    )
}

export default SourceCode