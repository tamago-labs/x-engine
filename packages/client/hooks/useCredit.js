// import { useWallet } from "@aptos-labs/wallet-adapter-react"
// import { useCallback } from "react";
// import BigNumber from "bignumber.js"
// import {
//     Account,
//     AccountAddress,
//     AnyNumber,
//     Aptos,
//     AptosConfig,
//     InputViewFunctionData,
//     Network,
//     NetworkToNetworkName,
// } from "@aptos-labs/ts-sdk";
// import { CONTRACT_ADDRESS, USDC_METADATA } from "@/constants";

// const useCredit = () => {

//     const { account, signAndSubmitTransaction } = useWallet()

//     const aptosConfig = new AptosConfig({ network: Network.TESTNET });
//     const aptos = new Aptos(aptosConfig);

//     const getFaBalance = async (owner) => {
//         const payload = {
//             function: `0x1::primary_fungible_store::balance`,
//             typeArguments: [
//                 "0x1::fungible_asset::Metadata"
//             ],
//             functionArguments: [
//                 owner,
//                 USDC_METADATA
//             ],
//         };
//         const result = await aptos.view({ payload });
//         return result[0] ? Number((BigNumber(`${result[0]}`)).dividedBy(BigNumber(10 ** 6))) : 0;
//     };

//     const getCreditBalance = async (owner) => {
//         const payload = {
//             function: `${CONTRACT_ADDRESS}::credit_system::credit_balance`,
//             functionArguments: [
//                 owner
//             ],
//         };
//         const result = await aptos.view({ payload });
//         return result[0] ? Number(result[0]) : 0;
//     }

//     const faucet = useCallback(async () => {

//         if (!account) {
//             return
//         }

//         const address = account && account.address

//         const transaction = {
//             data: {
//                 function: `${CONTRACT_ADDRESS}::mock_usdc_fa::mint`,
//                 functionArguments: [
//                     address,
//                     `${(BigNumber(10)).multipliedBy(BigNumber(10 ** 6))}`
//                 ]
//             }
//         }

//         const response = await signAndSubmitTransaction(transaction);
//         // wait for transaction
//         await aptos.waitForTransaction({ transactionHash: response.hash });

//     }, [account])

//     const buyCredit = useCallback(async () => {

//         if (!account) {
//             return
//         }

//         const transaction = {
//             data: {
//                 function: `${CONTRACT_ADDRESS}::credit_system::buy`,
//                 functionArguments: [
//                     1
//                 ]
//             }
//         }

//         const response = await signAndSubmitTransaction(transaction);
//         // wait for transaction
//         await aptos.waitForTransaction({ transactionHash: response.hash });

//     }, [account])

//     return {
//         getFaBalance,
//         buyCredit,
//         faucet,
//         getCreditBalance
//     }
// }

// export default useCredit