

const RegistryContainer = () => {
    return (
        <div className="grid grid-cols-10 ">
            <div className="col-span-2 bg-neutral-900 min-h-screen   pt-[29px]  border-r border-neutral-600 ">
                LEFT
            </div>
            <div className={`col-span-8 bg-neutral-900 pt-[29px] border-r border-neutral-600`}>
                 RIGHT
            </div> 
        </div>
    )
}

export default RegistryContainer