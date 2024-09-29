
import { ChevronDown, Play, Plus, PlusCircle, Trash2 } from "react-feather"
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa"
import TreeView, { flattenTree } from "react-accessible-treeview";
import { DiCss3, DiJavascript, DiNpm, DiCodeBadge, DiCode } from "react-icons/di";
import { slugify } from "@/helpers";
import { useContext } from "react";
import { AuthContext } from "@/hooks/useAuth";



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

const SubNavbar = ({ title, select, setSelect, list, isContext = false }) => {

    const { isLoggedIn, showModal } = useContext(AuthContext)

    const folder = {
        name: "",
        children: list ? list.map(item => {
            const name = !isContext ? item.split("# Review Summary - ")[1].split("\n")[0] : slugify(item.split("#")[1].split("\n")[0])
            return {
                name
            }
        }) : []
    };

    const data = flattenTree(folder);

    return (
        <>

            {!isLoggedIn && (
                <div className="h-full w-full flex flex-col">
                    <div className="m-auto text-center">
                        <button onClick={showModal} className={`bg-white text-sm w-[150px]   text-black font-bold py-2 rounded-md `}>
                            Login
                        </button>
                        <div className="text-center text-sm mt-[10px] text-gray-300  ">
                        Login to manage and customize context
                        </div>
                    </div>
                </div>
            )}

            {isLoggedIn && (
                <div>
                    <div className="flex flex-col">
                        <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                            <h4 className="m-auto text-gray-400 font-semibold uppercase text-sm tracking-wider">
                                {title}
                            </h4>
                        </div>
                        <div class="grid grid-cols-5 gap-2 px-2 mt-6">
                            <div class="col-span-2 flex">
                                <div className="pl-0.5">
                                    <label class="block text-sm font-medium text-gray-300">Categories</label>
                                </div>
                            </div>
                            <div class="col-span-3 flex justify-end pr-0.5">
                                <div onClick={() => alert("Not supported for now")} className="my-auto cursor-pointer ">
                                    <PlusCircle
                                        className="text-gray-300"
                                        size={16}
                                    />
                                </div>
                                <div onClick={() => alert("Not supported for now")} className="my-auto cursor-pointer ml-1">
                                    <Trash2
                                        className="text-gray-300"
                                        size={16}
                                    />
                                </div>
                            </div>
                            <div className="col-span-5">
                                <select id="categories" class="bg-gray-50 cursor-pointer font-mono border border-gray-300 text-gray-900 text-sm   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected={true} value={"Move Code Review"}>Move Code Review</option>
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
                                        list[element.id - 1] && setSelect({
                                            source_code: false,
                                            value: list[element.id - 1]
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
            )

            }
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

export default SubNavbar