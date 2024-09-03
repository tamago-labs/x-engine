
import { ChevronDown, Play, Plus, PlusCircle, Trash2 } from "react-feather"
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa"
import TreeView, { flattenTree } from "react-accessible-treeview";
import { DiCss3, DiJavascript, DiNpm, DiCodeBadge, DiCode } from "react-icons/di";
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

const SubNavbar = ({ title, select, setSelect, list, isContext = false }) => {

    console.log("list : ", list)

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
            <div className="col-span-2 bg-neutral-900 min-h-screen pt-[29px]  border-r border-neutral-600 ">
                <div className="flex flex-col">
                    <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                        <h4 className="m-auto text-gray-400 font-semibold uppercase text-sm tracking-wider">
                            {title}
                        </h4>
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
                                    list[element.id-1] && setSelect(list[element.id-1])
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

export default SubNavbar