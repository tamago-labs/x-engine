# Broken access controls

Due to missing or insufficient access controls, malicious parties can withdraw assets from the contract account that do not belong to them.

## Considerations

* Access controls are mandatory to implement in functions that involve admin or governance actions such as triggering fund transfers or modifying configurations.
* In Sui Move, access control can be managed using the `ManagerCap` object or by verifying ownership within the global state.
* In Aptos Move, access control can be managed by verifying ownership within the global state or by checking resource ownership against the caller.

## Samples

The following are sample codes with potential threats. Filenames have prefixes indicating Sui Move or Aptos Move, and those with the suffix _fixed refer to versions that show how to prevent these threats.


**sui_simple_drain.move**

```
module mswc_registry::sui_simple_drain {

  struct Pool {
    balance: Balance<SUI>
  }

  public entry fun withdraw_all(pool: &mut Pool, ctx: &mut TxContext) {
    let total_value = balance::value(&pool.balance);
    let withdrawn_balance = balance::split<SUI>(&mut pool.balance, total_value);
    transfer::public_transfer(coin::from_balance(withdrawn_balance, ctx), tx_context::sender(ctx));
  }

}
```

**sui_simple_drain_fixed.move**

```
module mswc_registry::sui_simple_drain_fixed {

  struct Pool {
    balance: Balance<SUI>
  }

  struct ManagerCap has key {
        id: UID
  }

  // Implement access control by provide ManagerCap
  public entry fun withdraw_all(pool: &mut Pool, _manager_cap: &ManagerCap, ctx: &mut TxContext) {
    let total_value = balance::value(&pool.balance);
    let withdrawn_balance = balance::split<SUI>(&mut pool.balance, total_value);
    transfer::public_transfer(coin::from_balance(withdrawn_balance, ctx), tx_context::sender(ctx));
  }

}
```

**aptos_simple_drain.move**

```
module mswc_registry::aptos_simple_drain {

  struct Pool {
    balance: u64,
    extend_ref: ExtendRef
  }

  public entry fun withdraw_all(sender: &signer) acquires Pool {
    let pool = borrow_global_mut<Pool>(@mswc_registry);
    let pool_signer = object::generate_signer_for_extending(&pool.extend_ref);

    let withdrawn_coin = coin::withdraw<AptosCoin>(&pool_signer, pool.balance);
    coin::deposit( signer::address_of(sender), withdrawn_coin);
  }

}
```

**aptos_simple_drain_fixed.move**

```
module mswc_registry::aptos_simple_drain_fixed {

  struct Pool {
    balance: u64,
    extend_ref: ExtendRef
  }

  public entry fun withdraw_all(sender: &signer) acquires Pool {
    assert!( signer::address_of(sender) == @mswc_registry, ERR_UNAUTHORIZED); // Implement access control
    let pool = borrow_global_mut<Pool>(@mswc_registry);
    let pool_signer = object::generate_signer_for_extending(&pool.extend_ref);

    let withdrawn_coin = coin::withdraw<AptosCoin>(&pool_signer, pool.balance);
    coin::deposit( signer::address_of(sender), withdrawn_coin);
  }

}
```
