# Differences Between Sui Move and Aptos Move

Sui Move and Aptos Move are both compiled programming languages based on the Move language, a platform-agnostic language to enable common libraries, tooling, and developer communities across blockchains with vastly different data and execution models developed by Facebook. They share basic standard libraries as shown below:

```
use std::acl;
use std::bcs;
use std::bit_vector;
use std::error;
use std::fixed_point32;
use std::hash;
use std::option;
use std::signer;
use std::string;
use std::vector;
```

Each has its own intermediate libraries for developers to use. Sui Move uses sui::* for the standard Sui Move library and sui_system::* for chain operations. Aptos has aptos_std::* for its standard Aptos Move library and aptos_framework::* for chain operations and utilities for token creation.

**We can identify whether the Move source code is for Sui Move or Aptos Move by distinguishing the libraries being imported.**

## Global Storage

In Aptos Move, resources and modules are stored in global storage and are owned by an account with a specific address. Transactions can freely access resources from any account in global storage when they run, using special operations such as move_to and move_from.

Below is an example of Aptos Move where the resource AMMConfig is created and bound to the sender's account.

```
move_to(sender, AMMConfig { 
    whitelist, 
    pools: table::new<String, Pool>(),
    extend_ref,
    enable_whitelist: true,
    owner_address: signer::address_of(sender)
});
```

Aptos Move uses the acquires keyword to specify which global resources (modules) a function will access or modify, along with the resource owner's address.

```
public fun get_owner(addr: address): address acquires AMMConfig {
    borrow_global<AMMConfig>(addr).owner_address
}
```

In Sui Move, object-centric global storage is implemented, where all resources have unique identifiers. A transaction's inputs are explicitly specified upfront using these unique identifiers, allowing the chain to schedule transactions with non-overlapping inputs in parallel.

Below is the same resource in Sui Move, where a unique identifier must be provided for each resource before transferring it to object-centric global storage.

```
transfer::share_object(AMMConfig {
    id: object::new(ctx),
    whitelist, 
    pools: table::new<String, Pool>(),
    enable_whitelist: true,
    treasury_address
});
```

When accessing a resource in Sui Move, the unique identifier received during its creation must be provided.

```
public fun get_owner(amm_config: &AMMConfig): address {
    amm_config.owner_address
}
```

## Signer

A signer is a type that represents the authorization and control of a resource or asset. The way signers are used differs significantly between Sui Move and Aptos Move, which is another factor distinguishing them.

In Aptos Move, when a signer is needed, it is always placed as the first parameter of the function, like this:

```
public entry fun mint(sender: &signer, input_amount: u64) acquires VaultGlobal
```

In contrast, Sui Move uses a transaction context (TxContext) that includes the sender's address, the transaction's digest ID, the transaction's epoch, and other details, as the last parameter:

```
public entry fun mint(wrapper: &mut SuiSystemState, global: &mut VaultGlobal, staked_sui: StakedSui, ctx: &mut TxContext)
```

