

const Loading = () => {
    return (
        <div className="screen_loader fixed inset-0 z-[60] grid place-content-center bg-neutral-800">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="200px"
                height="200px"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
            >
                <circle cx="50" cy="50" r="0" fill="none" stroke="#2563eb" strokeWidth="4">
                    <animate
                        attributeName="r"
                        repeatCount="indefinite"
                        dur="1s"
                        values="0;16"
                        keyTimes="0;1"
                        keySplines="0 0.2 0.8 1"
                        calcMode="spline"
                        begin="0s"
                    ></animate>
                    <animate
                        attributeName="opacity"
                        repeatCount="indefinite"
                        dur="1s"
                        values="1;0"
                        keyTimes="0;1"
                        keySplines="0.2 0 0.8 1"
                        calcMode="spline"
                        begin="0s"
                    ></animate>
                </circle>
            </svg>
        </div>
    )
}

export default Loading