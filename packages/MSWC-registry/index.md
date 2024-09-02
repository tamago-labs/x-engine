# Move Smart Contract Weakness Classification Registry

The Move Smart Contract Weakness Classification Registry (MSWC Registry) is an implementation of the weakness classification scheme proposed by Ethereum EIP-1470 and documented at [SWC Registry](https://github.com/SmartContractSecurity/SWC-registry). We're porting Solidity into the Move smart contract language for further review with an AI engine that is compatible with Sui Move and Aptos Move.

The following table provides an overview of the MSWC registry. Each row consists of an SWC identifier (ID), a weakness title, CWE parent and list of related code samples. We will continue to add more entries over time.


| ID                           | Title                                    | Relationships                                                                                           |
| ---------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------|
| [MSWC-101](./MSWC-101.md)    | Integer overflows and underflows         | [CWE-682: Incorrect Calculation](https://cwe.mitre.org/data/definitions/682.html)                       |
| [MSWC-106](./MSWC-106.md)    | Broken access controls                   | [CWE-284: Improper Access Control](https://cwe.mitre.org/data/definitions/284.html)                     |
| [MSWC-107](./MSWC-107.md)    | Re-entrancy                              | [CWE-841: Improper Enforcement of Behavioral Workflow](https://cwe.mitre.org/data/definitions/841.html) |
| [MSWC-120](./MSWC-120.md)    | Weak randomness                          | [CWE-330: Use of Insufficiently Random Values](https://cwe.mitre.org/data/definitions/330.html)         |
