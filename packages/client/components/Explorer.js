import { useCallback, useContext, useEffect, useState } from "react"
import { ArrowRight, ArrowLeft, Book, BookOpen, ChevronDown, Play, Plus, PlusCircle, Trash2, X } from "react-feather"
import { DiCss3, DiJavascript, DiNpm, DiCodeBadge, DiCode } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { AccountContext } from "@/hooks/useAccount";
import DeleteFileModal from "@/modals/deleteFile";
import DeleteProjectModal from "@/modals/deleteProject";
import NewProjectModal from "@/modals/newProject";
import NewFileModal from "@/modals/newFile";

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

const MODAL = {
    NONE: "NONE",
    DELETE_PROJECT: "DELETE_PROJECT",
    DELETE_FILE: "DELETE_FILE",
    NEW_PROJECT: "NEW_PROJECT",
    NEW_FILE: "NEW_FILE"
}

const Explorer = () => {

    const [modal, setModal] = useState(MODAL.NONE)

    const { selected, select, loadProjects, projects, submit, profile, report, openReport, isOpen, closeReport } = useContext(AccountContext)

    const [project_name, setProject] = useState()

    useEffect(() => {
        select(undefined)
        loadProjects()
    }, [])

    useEffect(() => {
        projects && projects[0] && setProject(projects[0].project_name)
    }, [projects])

    const onReview = useCallback(async () => {

        if (!selected) {
            return
        }

        const file_name = selected.name
        const source_code = selected.raw_value

        if (confirm("Submit a request") == true) {
            await submit(profile.slug, file_name, source_code)
            alert("Done. Please wait a few seconds and refresh.")
        }

    }, [selected, profile, submit])


    const project = project_name && projects && projects.find(item => item.project_name === project_name)

    const folder = {
        name: "",
        children: project ? project.files.map(item => {
            return {
                name: item.file_name
            }
        }) : []
    };

    const data = flattenTree(folder);

    return (
        <>
            <DeleteFileModal
                visible={modal === MODAL.DELETE_FILE}
                close={() => setModal(MODAL.NONE)}
                selected={selected}
            />
            <DeleteProjectModal
                visible={modal === MODAL.DELETE_PROJECT}
                close={() => setModal(MODAL.NONE)}
            />
            <NewProjectModal
                visible={modal === MODAL.NEW_PROJECT}
                close={() => setModal(MODAL.NONE)}
            />
            <NewFileModal
                visible={modal === MODAL.NEW_FILE}
                close={() => setModal(MODAL.NONE)}
            />

            <div className="flex flex-col">
                <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                    <h4 className="m-auto text-gray-400 font-semibold  text-sm tracking-wider">
                        EXPLORER
                    </h4>

                </div>
                <div class="grid grid-cols-5 gap-2 px-2 mt-6">
                    <div class="col-span-2 flex">
                        <div className="pl-0.5">
                            <label class="block text-sm font-medium text-gray-300">Projects</label>
                        </div>
                    </div>
                    <div class="col-span-3 flex justify-end pr-0.5">
                        <div onClick={() => setModal(MODAL.NEW_PROJECT)} className="my-auto cursor-pointer ">
                            <PlusCircle
                                className="text-gray-300"
                                size={16}
                            />
                        </div>
                        <div onClick={() => setModal(MODAL.DELETE_PROJECT)} className="my-auto cursor-pointer ml-1">
                            <Trash2
                                className="text-gray-300"
                                size={16}
                            />
                        </div>
                    </div>
                    <div className="col-span-5">
                        <select onChange={(e) => setProject(e.target.value)} id="countries" class="bg-gray-50 cursor-pointer font-mono border border-gray-300 text-gray-900 text-sm   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {projects.map((item) => {
                                return (
                                    <option selected={project_name === item.project_name} value={item.project_name}>{item.project_name}</option>
                                )
                            })}
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
                                const fileData = project.files.find(item => item.file_name === element.name)
                                select({
                                    ...element,
                                    value: atob(fileData.source_code),
                                    raw_value: fileData.source_code,
                                    project_name
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
                <div className="grid grid-cols-1 xl:grid-cols-3 text-center px-1  text-sm my-1">
                    <div className="col-span-1 p-1  ">
                        <button onClick={onReview} disabled={!selected} class={`bg-blue-500 text-center ${!selected && "opacity-60"} text-white mx-auto py-2  w-full flex flex-row  rounded `}>
                            <Play size={14} className="ml-auto mt-0.5 mr-0.5" />
                            <div className="mr-auto ">
                                Review
                            </div>
                        </button>
                    </div>
                    <div className="col-span-1 p-1  ">
                        <button onClick={() => setModal(MODAL.NEW_FILE)} class={`bg-white   text-center   text-black mx-auto py-2  w-full  flex flex-row  rounded `}>
                            <Plus size={14} className="ml-auto mt-0.5 mr-0.5" />
                            <div className="mr-auto ">
                                New
                            </div>
                        </button>
                    </div>
                    <div className="col-span-1 p-1 ">
                        <button onClick={() => setModal(MODAL.DELETE_FILE)} disabled={!selected} class={`bg-white text-center  ${!selected && "opacity-60"} text-black  mx-auto py-2   w-full flex flex-row  rounded `}>
                            <Trash2 size={14} className="ml-auto mt-0.5 mr-0.5" />
                            <div className="mr-auto ">
                                Delete
                            </div>
                        </button>
                    </div>
                </div>

                <div className="p-2 mt-1">
                    <div className="border-neutral-600 border p-2 text-[#D4D4D4] pb-3 rounded">

                        {!report && (
                            <div className="mx-auto text-sm py-2 mb-1 w-full max-w-[300px] text-center">
                                This file has not yet been reviewed 
                            </div>
                        )

                        }

                        {report && (
                            <>
                                <div className="mx-auto text-sm py-2 mb-1 w-full max-w-[300px] text-center">
                                    The report is ready
                                </div> 
                            </>
                        ) }

                        <button onClick={() => !isOpen ? openReport() : closeReport()} disabled={!report} class={`bg-white ${!report && "opacity-60"}  text-center   text-black mx-auto py-2  w-full  flex flex-row  rounded `}>
                            <div className="ml-auto text-sm">
                                {!isOpen ? "Open" : "Close"} Report
                            </div>
                            {!isOpen 
                            ?
                            <ArrowRight size={16} className="mr-auto  mt-0.5 ml-0.5" />
                            :
                            <X size={16} className="mr-auto  mt-0.5 ml-0.5" />

                            }
                            
                        </button>


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

export default Explorer