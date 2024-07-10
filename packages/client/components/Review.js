import Editor from '@monaco-editor/react';
import { useState } from 'react';


const files = {
    'script.js': {
        name: 'script.js',
        language: 'javascript',
        value: `
console.log("hello from here");
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

const CodeReview = () => {

    const [fileName, setFileName] = useState('script.js');

    const file = files[fileName];

    return (
        <div>
            <button disabled={fileName === 'script.js'} onClick={() => setFileName('script.js')}>
                script.js
            </button>
            <button disabled={fileName === 'style.css'} onClick={() => setFileName('style.css')}>
                style.css
            </button>
            <button disabled={fileName === 'index.html'} onClick={() => setFileName('index.html')}>
                index.html
            </button>
            <Editor
                height="80vh"
                theme="vs-dark"
                path={file.name}
                defaultLanguage={file.language}
                defaultValue={file.value}
            />
        </div>
    )
}

export default CodeReview