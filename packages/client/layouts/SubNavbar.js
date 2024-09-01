


const SubNavbar = ({ title }) => {
    return (
        <div className="col-span-2 bg-neutral-900 min-h-screen pt-[29px]  border-r border-neutral-600 ">
            <div className="flex flex-col">
                <div className="h-[40px] border-b w-full border-neutral-600 flex ">
                    <h4 className="m-auto text-gray-400 font-semibold uppercase text-sm tracking-wider">
                        {title}
                    </h4>
                </div>
            </div>
        </div>
    )
}

export default SubNavbar