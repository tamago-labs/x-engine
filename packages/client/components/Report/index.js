import SubNavbar from "@/layouts/SubNavbar"


const ReportContainer = () => {
    return (
        <div className="grid grid-cols-10 ">
            <SubNavbar/>
            <div className={`col-span-8 bg-neutral-900 pt-[29px] border-r border-neutral-600`}>
                RIGHT
            </div>
        </div>
    )
}

export default ReportContainer