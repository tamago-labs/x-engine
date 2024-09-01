# Move Smart Contract Weakness Classification Registry

The Move Smart Contract Weakness Classification Registry (MSWC Registry) is an implementation of the weakness classification scheme proposed by Ethereum EIP-1470 and documented at [SWC Registry](https://github.com/SmartContractSecurity/SWC-registry). We're porting Solidity into the Move smart contract language for further review with an AI engine that is compatible with Sui Move and Aptos Move.

The following table provides an overview of the MSWC registry. Each row consists of an SWC identifier (ID), a weakness title. We will continue to add more entries over time.


| ID                           | Title                                                   | 
| ---------------------------- | ------------------------------------------------------- | 
| [MSWC-101](./MSWC-101.md)    | Integer overflows and underflows                        | 
| [MSWC-106](./MSWC-106.md)    | Broken access controls                                  |
| [MSWC-107](./MSWC-107.md)    | Re-entrancy                                             | 
| [MSWC-120](./MSWC-120.md)    | Weak randomness                                         | 
