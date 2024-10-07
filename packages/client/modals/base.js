import { X } from "react-feather"


const BaseModal = ({
    visible,
    title,
    close,
    children,
    borderColor = "border-neutral-600",
    maxWidth = "max-w-2xl",
    showCloseButton = true
}) => {
    return (
        <>
            {visible && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-neutral-900 opacity-60"></div>
                    <div className={`relative mx-2 bg-neutral-800 rounded-lg p-6 w-full  ${maxWidth} border ${borderColor} text-white `} data-aos="zoom-in" data-aos-duration="400">
                        <h5 className="text-xl font-bold mb-2">{title}</h5>
                        {showCloseButton && (
                            <button className="absolute top-3 right-3" onClick={close}>
                                <X />
                            </button>
                        )} 
                        {children}
                    </div>
                </div>
            )}
        </>
    )
}

export default BaseModal