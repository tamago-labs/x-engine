import { AccountContext } from "@/hooks/useAccount"
import { useContext } from "react"
import { useRouter } from "next/router"
import { X } from "react-feather"
import Markdown from 'react-markdown'
import TreeView, { flattenTree } from "react-accessible-treeview";
import { ChevronDown } from "react-feather"
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { DiCss3, DiJavascript, DiNpm, DiCodeBadge, DiCode } from "react-icons/di";

const FolderIcon = ({ isOpen }) =>
    isOpen ? (
        <FaRegFolderOpen color="e8a87c" className="icon" />
    ) : (
        <FaRegFolder color="e8a87c" className="icon" />
    );

const FileIcon = ({ filename }) => {
    const extension = filename.slice(filename.lastIndexOf(".") + 1);
    switch (extension) {
        case "js":
            return <DiJavascript color="yellow" className="icon" />;
        case "css":
            return <DiCss3 color="turquoise" className="icon" />;
        case "json":
            return <FaList color="yellow" className="icon" />;
        case "npmignore":
            return <DiNpm color="red" className="icon" />;
        case "move":
            return <DiCode color="white" className="icon text-2xl" />;
        default:
            return null;
    }
};


const ReportNew = () => {

    const { report, closeReport, projects, selected } = useContext(AccountContext)

    const router = useRouter()

    const { query } = router
    const { slug } = query
    const filename = selected && selected.name

    const folder = {
        name: "",
        children: report && filename ? [
            {
                name: filename
            }
        ] : []
    };

    const data = flattenTree(folder);

    return (
        <>
            <div className="grid grid-cols-10 ">
                <div className="col-span-2 bg-neutral-900 min-h-screen   pt-[29px]  border-r border-neutral-600 ">
                    <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                        <h4 className="m-auto text-gray-400 font-semibold  text-sm tracking-wider">
                            {slug}
                        </h4>

                    </div>
                    <div className="p-2 mt-1">
                        <div className="text-white flex flex-row">
                            <ChevronDown size={16} className="mt-1" />
                            <div className="my-auto ml-1.5">
                                {selected && selected.project_name}
                            </div>
                        </div>
                        <div className="directory text-white ">
                            <TreeView
                                data={data}
                                aria-label="directory tree"
                                nodeRenderer={({
                                    element,
                                    isBranch,
                                    isExpanded,
                                    getNodeProps,
                                    level,
                                }) => (
                                    <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
                                        {isBranch ? (
                                            <FolderIcon isOpen={isExpanded} />
                                        ) : (
                                            <FileIcon filename={element.name} />
                                        )}

                                        {element.name}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className={`col-span-8   pt-[29px]  `}>
                    {report && (
                        <div className="p-6 pt-2 pr-4 text-white text-base max-h-[95vh] flex flex-col  overflow-auto">
                            <Markdown>{report}</Markdown>
                        </div>
                    )}
                </div>

            </div>
            <style>
                {`
                .directory {  
                    padding-left: 20px;
                    padding-top: 5px;
                    font-family: monospace;
                    font-size: 16px;
                    color: white;
                    user-select: none; 
                    border-radius: 0.4em;
                  }
                  
                  .directory .tree,
                  .directory .tree-node,
                  .directory .tree-node-group {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                  }
                  
                  .directory .tree-branch-wrapper,
                  .directory .tree-node__leaf {
                    outline: none;
                    outline: none;
                  }
                  
                  .directory .tree-node { 
                    display: flex;
                  }
                  
                  .directory .tree-node:hover {
                    background: rgba(255, 255, 255, 0.1);
                  }
                  
                   
                  
                  .directory .tree-node__branch {
                    display: block;
                  }
                  
                  .directory .icon {
                    vertical-align: middle;
                    padding-right: 5px;
                  }
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
        </>
    )

}

export default ReportNew