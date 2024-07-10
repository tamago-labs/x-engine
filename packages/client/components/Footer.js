import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="mt-auto bg-neutral-950 h-[28px]">
            <div className=" text-xs  text-white flex p-1.5">
                <div>
                    © {new Date().getFullYear() + ' '}
                    <Link href="https://tamagolabs.com" className="text-white transition ">
                        Tamago Labs
                    </Link>
                </div>
                <div className='flex flex-row '>
                    <div className=" px-2">
                        <Link href="https://docs.tamagolabs.com/privacy-policy" target="_blank" className="text-white transition hover:text-secondary">
                            Privacy Policy
                        </Link>
                    </div>
                    <div className="  px-2">
                        <Link href="https://docs.tamagolabs.com/terms-of-service" target="_blank" className="text-white transition hover:text-secondary">
                            Term of Service
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer