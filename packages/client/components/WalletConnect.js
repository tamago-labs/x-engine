// import { AccountContext } from "@/hooks/useAccount";
// import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
// import { useContext, useEffect, useState } from "react";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import useCredit from "@/hooks/useCredit";


// const WalletConnect = () => {

//     const { account } = useWallet()
//     const address = account && account.address
 
//     return (
//         <>
//             <div className='ml-auto p-1 mr-1 font-mono flex flex-row'>
                 
//                 <WalletSelector />
//             </div>
//             <style>
//                 {
//                     `
//                         .wallet-button { 
//                             width: 200px;
//                             z-index: 1;
//                             background: white;
//                             color: #222;
//                             font-family: monospace, monospace;
//                             font-size: 14px;
//                             border-radius: 4px;
//                         } 
//                     `
//                 }
//             </style>
//         </>
//     )
// }

// export default WalletConnect