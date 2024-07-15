#[test_only]
module credit_addr::credit_system_tests {

    use std::string::utf8;
    use std::signer;

    use aptos_framework::account;
    use aptos_framework::primary_fungible_store;
    use aptos_framework::object::{  Object };
    use aptos_framework::fungible_asset::{ Metadata };


    use credit_addr::mock_usdc_fa;
    use credit_addr::credit_system;

    #[test(deployer = @credit_addr, user = @0xbeef )]
    fun test_e2e(deployer: &signer, user: &signer) {
        credit_system::init_module_for_testing(deployer);
        mock_usdc_fa::init_module_for_testing(deployer);

        credit_system::add_settlement(deployer, mock_usdc_fa::get_metadata());

        mock_usdc_fa::mint( signer::address_of(user), 1500000  );

        credit_system::buy( user, 3 );

        assert!( credit_system::credit_balance( signer::address_of(user) ) == 3, 1);

    }

}