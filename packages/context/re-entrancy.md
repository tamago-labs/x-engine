# Re-entrancy

One of the major dangers of calling external contracts is that they can take over the control flow. In the reentrancy attack (a.k.a. recursive call attack), a malicious contract calls back into the calling contract before the first invocation of the function is finished. This may cause the different invocations of the function to interact in undesirable ways.

## Considerations

* Move is practically safe from re-entrancy attacks by theory. However, given the relatively low composability in the Move ecosystem compared to Ethereum's Solidity, it is still recommended to take precautions.
* Design smart contract functions to perform atomic operations, meaning that state changes are completed in a single transaction without interruption.
* Minimize or eliminate external calls within critical sections of your code to prevent the potential reentry of malicious actors.

## Samples

The following are sample codes with potential threats. Filenames have prefixes indicating Sui Move or Aptos Move, and those with the suffix _fixed refer to versions that show how to prevent these threats.

**sui_simple_dao.move**

```
module mswc_registry::sui_simple_dao {

  struct DAO {
    balance: Balance<SUI>,
    credit_table: Table<address, u64>
  }

  public entry fun donate(dao: &mut DAO, coin: Coin<SUI>, to_address: address) {
    let coin_value = coin::value(&coin);
    let mut coin_balance = coin::into_balance(coin);
    balance::join(&mut dao.balance, coin_balance);
    if (!table::contains(&dao.credit_table, to_address)) {
      table::add( &mut dao.credit_table, to_address, coin_value );
    } else {
      *table::borrow_mut(&mut dao.credit_table, to_address) = *table::borrow(&dao.credit_table, to_address)+coin_value;
    };
  }

  public entry fun withdraw(dao: &mut DAO, amount: u64, ctx: &mut TxContext) {
    *table::borrow_mut(&mut dao.credit_table, tx_context::sender(ctx)) = *table::borrow(&dao.credit_table, tx_context::sender(ctx))-amount;
    let withdrawn_balance = balance::split<SUI>(&mut dao.balance, amount);
    transfer::public_transfer(coin::from_balance(withdrawn_balance, ctx), tx_context::sender(ctx));
  }
 
}
```

**sui_simple_dao_fixed.move**

```
module mswc_registry::sui_simple_dao_fixed {

  struct DAO {
    balance: Balance<SUI>,
    credit_table: Table<address, u64>
  }

  public entry fun donate(dao: &mut DAO, coin: Coin<SUI>, to_address: address) {
    let coin_value = coin::value(&coin);
    let mut coin_balance = coin::into_balance(coin);
    balance::join(&mut dao.balance, coin_balance);
    if (!table::contains(&dao.credit_table, to_address)) {
      table::add( &mut dao.credit_table, to_address, coin_value );
    } else {
      *table::borrow_mut(&mut dao.credit_table, to_address) = *table::borrow(&dao.credit_table, to_address)+coin_value;
    };
  }

  public entry fun withdraw(dao: &mut DAO, amount: u64, ctx: &mut TxContext) {
    let withdrawn_balance = balance::split<SUI>(&mut dao.balance, amount);
    transfer::public_transfer(coin::from_balance(withdrawn_balance, ctx), tx_context::sender(ctx));
    *table::borrow_mut(&mut dao.credit_table, tx_context::sender(ctx)) = *table::borrow(&dao.credit_table, tx_context::sender(ctx))-amount;
  }
 
}
```


**aptos_simple_dao.move**

```
module mswc_registry::aptos_simple_dao {

  struct DAO {
    balance: u64,
    credit_table: Table<address, u64>,
    extend_ref: ExtendRef
  }

  public entry fun donate(sender: &signer, amount: u64, to_address: address) acquires DAO {
    let dao = borrow_global_mut<DAO>(@mswc_registry);
    let dao_signer = object::generate_signer_for_extending(&dao.extend_ref);

    let deposit_coin = coin::withdraw<AptosCoin>(sender, amount);
    coin::deposit( signer::address_of(&dao_signer), deposit_coin);

    if (!table::contains(&dao.credit_table, to_address)) {
      table::add( &mut dao.credit_table, to_address, amount );
    } else {
      *table::borrow_mut(&mut dao.credit_table, to_address) = *table::borrow(&dao.credit_table, to_address)+amount;
    };
    
    dao.balance = dao.balance+amount;
  }

  public entry fun withdraw(sender: &signer, amount: u64) acquires DAO {
    let dao = borrow_global_mut<DAO>(@mswc_registry);
    let dao_signer = object::generate_signer_for_extending(&dao.extend_ref);

    *table::borrow_mut(&mut dao.credit_table, signer::address_of(sender)) = *table::borrow(&dao.credit_table, signer::address_of(sender))-amount;
    dao.balance = dao.balance-amount;

    let withdrawn_coin = coin::withdraw<AptosCoin>(&dao_signer, amount);
    coin::deposit( signer::address_of(sender), withdrawn_coin);
  }
 
}
```


**aptos_simple_dao_fixed.move**

```
module mswc_registry::aptos_simple_dao_fixed {

  struct DAO {
    balance: u64,
    credit_table: Table<address, u64>,
    extend_ref: ExtendRef
  }

  public entry fun donate(sender: &signer, amount: u64, to_address: address) acquires DAO {
    let dao = borrow_global_mut<DAO>(@mswc_registry);
    let dao_signer = object::generate_signer_for_extending(&dao.extend_ref);

    let deposit_coin = coin::withdraw<AptosCoin>(sender, amount);
    coin::deposit( signer::address_of(&dao_signer), deposit_coin);

    if (!table::contains(&dao.credit_table, to_address)) {
      table::add( &mut dao.credit_table, to_address, amount );
    } else {
      *table::borrow_mut(&mut dao.credit_table, to_address) = *table::borrow(&dao.credit_table, to_address)+amount;
    };
    
    dao.balance = dao.balance+amount;
  }

  public entry fun withdraw(sender: &signer, amount: u64) acquires DAO {
    let dao = borrow_global_mut<DAO>(@mswc_registry);
    let dao_signer = object::generate_signer_for_extending(&dao.extend_ref);

    let withdrawn_coin = coin::withdraw<AptosCoin>(&dao_signer, amount);
    coin::deposit( signer::address_of(sender), withdrawn_coin);

    *table::borrow_mut(&mut dao.credit_table, signer::address_of(sender)) = *table::borrow(&dao.credit_table, signer::address_of(sender))-amount;
    dao.balance = dao.balance-amount;
  }
 
}
```
