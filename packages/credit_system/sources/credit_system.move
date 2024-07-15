// Copyright (c) Tamago Blockchain Labs, Inc.
// SPDX-License-Identifier: MIT

// A credit system contract allows users to buy credits for each code review request.
// Users can purchase credits using stablecoins.


module credit_addr::credit_system {

    use std::signer;  
    use std::option::{Self, Option};
    use aptos_std::table::{Self, Table};
    use aptos_framework::fungible_asset::{ Metadata };
    use aptos_framework::primary_fungible_store;
    use aptos_framework::object::{Self, Object};


    // ======== Constants ========

    // The default price which is 0.5 USDC
    const DEFAULT_PRICE : u64 = 500000;
    // The maximum amount of credits a user is allowed to buy
    const MAX_CREDIT_ALLOWED : u64 = 100;

    // ======== Errors ========

    const ERR_INVALID_CREDIT: u64 = 1;
    const ERR_UNAUTHORIZED: u64 = 2;
    const ERR_SETTLEMENT_NOT_SET: u64 = 3;
    const ERR_ZERO: u64 = 4;
    const ERR_INSUFFICIENT_AMOUNT: u64 = 5;

    // ======== Structs =========

    // Represents the global state
    struct Global has key {
        price: u64,
        settlement_asset: Option<Object<Metadata>>,
        treasury_address: address,
        credit_table: Table<address, u64>
    }

    // Constructor for this module.
    fun init_module(sender: &signer) {

        move_to(sender, Global {
            price: DEFAULT_PRICE,
            treasury_address: signer::address_of(sender),
            credit_table: table::new<address, u64>(),
            settlement_asset: option::none()
        });

    }

    // ======== Entry Points =========

    public entry fun buy(sender: &signer, total_credit: u64) acquires Global {
        // Ensure the total_credit is greater than 0
        assert!(total_credit > 0, ERR_ZERO);
        // Ensure the total_credit does not exceed the maximum allowed credits
        assert!( total_credit <= MAX_CREDIT_ALLOWED, ERR_INVALID_CREDIT );
        let global = borrow_global_mut<Global>(@credit_addr);
        // Ensure that the settlement asset is set
        assert!( option::is_some(&global.settlement_asset), ERR_SETTLEMENT_NOT_SET );

        // Retrieve the metadata of the settlement asset
        let metadata = option::destroy_some( global.settlement_asset );

        let total_amount = total_credit*global.price;
        assert!(primary_fungible_store::balance( signer::address_of(sender), metadata) >= total_amount, ERR_INSUFFICIENT_AMOUNT); 

        // Transfer to the treasury address
        primary_fungible_store::transfer(sender, metadata, global.treasury_address, total_amount);

        // Check if the sender already has credits in the credit table
        if (!table::contains(&global.credit_table, signer::address_of(sender))) { 
            // If not, add a new entry 
            table::add(
                &mut global.credit_table,
                signer::address_of(sender),
                total_credit
            );
        } else {
            // If yes, update the existing entry
            *table::borrow_mut( &mut global.credit_table, signer::address_of(sender) ) = *table::borrow( &global.credit_table, signer::address_of(sender) )+total_credit;
        };

    }

    #[view]
    public fun credit_balance(user_address: address): u64 acquires Global {
        let global = borrow_global<Global>(@credit_addr);
        if (!table::contains(&global.credit_table, user_address)) {
            0
        } else {
            *table::borrow(&global.credit_table, user_address)
        }
    }

    #[view]
    public fun get_treasury_address(): address acquires Global {
        let global = borrow_global<Global>(@credit_addr);
        global.treasury_address
    }

    #[view]
    public fun get_current_price(): u64 acquires Global {
        let global = borrow_global<Global>(@credit_addr);
        global.price
    }

    #[view]
    public fun get_settlement_assset(): Object<Metadata> acquires Global {
        let global = borrow_global<Global>(@credit_addr);
        option::destroy_some( global.settlement_asset )
    }

    // ======== Only Governance =========

    public entry fun update_price(sender: &signer, new_price: u64) acquires Global {
        assert!( signer::address_of(sender) == @credit_addr , ERR_UNAUTHORIZED);
        let global = borrow_global_mut<Global>(@credit_addr);
        global.price = new_price;
    }

    public entry fun update_treasury_address(sender: &signer, new_address: address) acquires Global {
        assert!( signer::address_of(sender) == @credit_addr , ERR_UNAUTHORIZED);
        let global = borrow_global_mut<Global>(@credit_addr);
        global.treasury_address = new_address;
    }

    public entry fun add_settlement(sender: &signer, metadata: Object<Metadata>) acquires Global {
        assert!( signer::address_of(sender) == @credit_addr , ERR_UNAUTHORIZED);
        let global = borrow_global_mut<Global>(@credit_addr);
        global.settlement_asset = option::some(metadata);
    }

    // ======== Test-related Functions =========

    #[test_only] 
    public fun init_module_for_testing(deployer: &signer) {
        init_module(deployer)
    }

}