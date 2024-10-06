import { ChevronDown, Play, Plus, PlusCircle, Trash2 } from "react-feather"
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa"
import { AuthContext } from "@/hooks/useAuth";
import { useContext, useEffect, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { slugify } from "@/helpers";

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

const ContextList = ({ selected, setSelect }) => {

    const [contextName, setContextName] = useState("default")
    const [dataList, setDataList] = useState([])
    const { getContext } = useContext(AuthContext)

    useEffect(() => {
        getContext(contextName).then(setDataList)
    }, [contextName])

    const folder = {
        name: "",
        children: dataList ? dataList.map(item => { 
            const name = slugify(item.split("#")[1].split("\n")[0]) 
            return { 
                name
            }
        }) : []
    };

    const data = flattenTree(folder);

    return (
        <>
            <div>
                <div className="flex flex-col">
                    <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                        <h4 className="m-auto text-gray-400 font-semibold uppercase text-sm tracking-wider">
                            Detector
                        </h4>
                    </div>
                    <div class="grid grid-cols-5 gap-2 px-2 mt-6">
                        <div class="col-span-2 flex">
                            <div className="pl-0.5">
                                <label class="block text-sm font-medium text-gray-300">Context</label>
                            </div>
                        </div>
                        <div className="col-span-5">
                            <select id="categories" value={contextName} onChange={(e) => setContextName(e.target.value)} class="bg-gray-50 cursor-pointer font-mono border border-gray-300 text-gray-900 text-sm   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value={"default"}>Move Vulnerability Detection </option>
                                <option value={"gas-optimize"}>Move Gas Optimization </option>
                            </select>
                        </div>
                    </div>
                    <div className="p-2 mt-1">
                        <div className="text-white flex flex-row">
                            <ChevronDown size={16} className="mt-1" />
                            <div className="my-auto ml-1.5">
                                src
                            </div>
                        </div>
                        <div className="directory ">
                            <TreeView
                                data={data}
                                onNodeSelect={({ element }) => {
                                    dataList[element.id - 1] && setSelect({
                                        source_code: false,
                                        value: dataList[element.id - 1]
                                    })
                                }}
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
                    cursor: pointer;
                    display: flex;
                  }
                  
                  .directory .tree-node:hover {
                    background: rgba(255, 255, 255, 0.1);
                  }
                  
                  .directory .tree .tree-node--focused {
                    background: rgba(255, 255, 255, 0.2);
                  }
                  
                  .directory .tree .tree-node--selected {
                    background: rgba(255, 255, 255, 0.1);
                  }
                  
                  .directory .tree-node__branch {
                    display: block;
                  }
                  
                  .directory .icon {
                    vertical-align: middle;
                    padding-right: 5px;
                  }
                `}
            </style>
        </>
    )
}

export default ContextList