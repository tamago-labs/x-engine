# Aptos Move Gas Optimization

This article provides a guide for gas optimization in Aptos Move smart contracts collected from several sources following and does not apply to Sui Move:
- https://medium.com/cryptocurrency-scripts/aptos-move-gas-optimization-proven-strategies-for-peak-performance-and-efficiency-10015d4e55d9
- https://www.eecg.utoronto.ca/~veneris/brains23.pdf
- https://github.com/Veneris-Group/Move-Gas-Optimization-Patterns


The gas used by a transaction consists of summing the gas associated with the size of its payload (payload gas), the virtual machine instructions it executes (instruction gas), and the global storage it accesses (storage gas):

- **Payload gas** - transaction size gas, the cost of publishing bytecode to the Aptos blockchain.
- **Instruction gas** - the cost of performing a transaction on the Aptos blockchain.
- **Storage gas** - the cost for writing and accessing Aptos global storage resources.

 # Gas Optimization Patterns

This section provides both general principles and specific design patterns for optimizing gas consumption in Move smart contracts on Aptos. Each principle is accompanied by an example smart contract demonstrating its application.

## Payload Gas Optimization

The gas associated with the payload is typically much less than the gas associated with instructions and global storage. Thus, for most applications, its contribution is negligible. However, if the payload greatly exceeds 600 bytes, then it may cause a noticeable increase due to Aptos large transaction penalty. We give the following general principles for payload
gas optimization

### Minimize the Length of Modules 
The code of a published module is stored on the blockchain, which consumes gas. Minimizing the length of the module, i.e. the number of bytes required to store its bytecode, reduces the total gas cost.

### Minimize the Size of Parameters 
When executing a transaction script, the payload may contain the values of the parameters given by the user, which are stored on the blockchain and thus consumes gas. For example, combining many small functions that require a lot of parameters into one larger function, and also avoiding passing resources as parameters into functions.

## Instruction Gas Optimization

The gas associated with virtual machine instructions. In general, less virtual machine operations mean less gas consumption. However, this is not always possible without sacrificing the
necessary functionality. We give the following general principles for instruction gas optimization

### Limit Function Calls

One of the most expensive instruction gas operations are function calls. The gas saved from the lack of a function call is always larger than the gas gained from a larger module size. Therefore, abstracting smart contract functionality into helper functions should be avoided as much as possible. For instance, it is very common for programmers to write getter functions which are a single line or very few lines of code. Removing these is a small change, which saves a large percentage of gas.

```
module move_gas_optimization::limit_function_calls {
   

   public fun helper_function() {

    }


    //aptos move run --function-id 'default::limit_function_calls::function_call'
    public entry fun function_call() {
        let k:u64 = 0;
        while (k < 1000) {
            helper_function();
            k = k + 1;
        };
    }
    // 47 Octa

    
    //aptos move run --function-id 'default::limit_function_calls::no_function_call'
    public entry fun no_function_call() {
        let k:u64 = 0;
        while (k < 1000) {
            // no function call
            k = k + 1;
        };
    }
    // 21 Octa


}
```

### Minimize Vector Element Operations

Vector operations charge gas on a per-element basis, and are more expensive than operations on local variables. Thus, accessing vectors can be treated like accessing the global state.
 
```
module move_gas_optimization::minimize_vector_element_operations {
    use std::vector;
    
    //aptos move run --function-id 'default::minimize_vector_element_operations::bad_vector_access'
    public entry fun bad_vector_access() {
        let vec = vector::empty<u64>();
        vector::push_back(&mut vec, 1);
        let k:u64 = 0;
        while (k < 1000) {
            k = k + *vector::borrow(&vec, 0);
        };
    }
    // 1295 Octa


    //aptos move run --function-id 'default::minimize_vector_element_operations::good_vector_access'
    public entry fun good_vector_access() {
        let vec = vector::empty<u64>();
        vector::push_back(&mut vec, 1);
        let increment:u64 = *vector::borrow(&vec, 0);
        let k:u64 = 0;
        while (k < 1000) {
            k = k + increment;
        };
    }
    // 41 Octa

}
```

###  Short Circuit

When using the logical connective AND `(&&)`, if the first expression evaluates to `false`, then the second expression will not be evaluated. Likewise, when using the logical connective OR `(||)`, if the first expression evaluates to true, then the second expression will not be evaluated. Thus, continued expressions in if-statements and while-loops should be ordered by increasing gas cost. If a cheap expression short-circuits the condition check, then we save on evaluating the more expensive expressions.

```
module move_gas_optimization::short_circuit {

    public fun expensive_function(): bool {
        let k:u64 = 0;
        while (k < 100000) {
            k = k + 1;
        };
        let b: bool = (k == 0);
        b
    }
    // always returns False

    public fun cheap_function(): bool {
        let k:u64 = 0;
        while (k < 10) {
            k = k + 1;
        };
        let b: bool = (k == 0);
        b
    }
    // always returns False


    //aptos move run --function-id 'default::short_circuit::no_short_circuit'
    public entry fun no_short_circuit() {
        if (expensive_function() && cheap_function()) {

        };
    }
    // 2372 Octa


    //aptos move run --function-id 'default::short_circuit::short_circuit'
    public entry fun short_circuit() {
        if (cheap_function() && expensive_function()) {

        };
    }
    // 200 Octa

}
```

### Write Values Explicitly

Since virtual machine operations consume gas, any constant values should be written explicitly rather than implicitly computed via the smart contract.

```
module move_gas_optimization::write_values_explicitly {
   
    public fun sum(n: u128): u128 {
        let total:u128 = 0;
        let k:u128 = 0;
        while (k < n) {
            total = total + k;
            k = k + 1;
        };
        total
    }

    //aptos move run --function-id 'default::write_values_explicitly::calculate'
    public entry fun calculate() {
        let x: u128 = sum(10000);
    }
    // 410 Octa


    //aptos move run --function-id 'default::write_values_explicitly::explicit'
    public entry fun explicit() {
        let x: u128 = 50005000;
    }
    // 2 Octa

}
```

### Avoid Redundant Operations

Since virtual machine operations consume gas, redundant operations should be avoided. For example, Move has a bytecode verifier that checks for common vulnerabilities such as integer overflow/underflow. Thus, checking for this in a smart contract is redundant and unnecessary.

## Storage Gas Optimization

The gas associated with global storage. In general, less accesses to global storage will result in less gas consumption. Moreover, storage gas will typically dominate both payload and instruction gas. Thus, it should be given the most attention when optimizing smart contract gas. The following general principles are given for storage gas optimization.

###  Operate on Local Variables

Operating directly on resources and resource fields consumes significantly more gas than operating on local variables. Whenever a smart contract is operating on the values of a resource, its ownership should be borrowed by a local variable. If necessary, those values can be transferred back to the resource at the end of the function.

This pattern can be implemented when accessing a resource field value in a loop. One should first store its field value in an intermediate local variable and do all loop operations on
this local variable. At the end of the function, the resource is updated. This limits the number of accesses to the resource to a maximum of two, rather than the number of loop iterations.

```
module move_gas_optimization::operate_on_local_variables {
    use std::signer;
    
    struct MyResource has key, store {
        value: u64
    }

    //aptos move run --function-id 'default::operate_on_local_variables::create_resource'
    public entry fun create_resource(account: signer) {
        move_to<MyResource>(&account, MyResource {
                value: 1
            });
    }

    //aptos move run --function-id 'default::operate_on_local_variables::bad_resource_write'
    public entry fun bad_resource_write(account: &signer) 
    acquires MyResource{
        let resource = borrow_global_mut<MyResource>(signer::address_of(account));
        resource.value = 0;
        while (resource.value < 100000) {
            //
            // operate on resource.field
            //
            resource.value = resource.value + 1;
        };
    }
    // 62 Octa


    //aptos move run --function-id 'default::operate_on_local_variables::good_resource_write'
    public entry fun good_resource_write(account: &signer) 
    acquires MyResource{
        let resource = borrow_global_mut<MyResource>(signer::address_of(account));
        resource.value = 0;
        let intermediate = resource.value;

        while (intermediate < 100000) {
            //
            // operate on intermediate
            //
            intermediate = intermediate + 1;
        };
        resource.value = intermediate;
    }
    // 27 Octa

}
```

### Variable Packing

Variable packing refers to representing many variables of data using a single resource field. For example, consider variables `x8`, `x32`, and `x24` that will only ever store 8, 32, and 24 bits of information, respectively. The naive way of storing these is to separate them each into their own field. However, we can save on storage by packing these variables into a single u64 integer, and use bitwise masking to unpack the variables. Thus, saving on per-item global accesses.

```
module move_gas_optimization::variable_packing {
    use std::signer;

    struct MyResource2 has key, store {
        x8: u8, 
        x32: u64,
        x24: u64
    }

    struct MyPackedResource has key, store {
        x: u64
    }

    //aptos move run --function-id 'default::variable_packing::create_resource'
    public entry fun create_resource(account: signer) {
        move_to<MyResource>(&account, MyResource {
                x8: 1,
                x32: 1,
                x24: 1
            });
    }

    //aptos move run --function-id 'default::variable_packing::create_packed_resource'
    // 503
    public entry fun create_packed_resource(account: signer) {
        move_to<MyPackedResource>(&account, MyPackedResource {
                x: 1
            });
    }

    //aptos move run --function-id 'default::variable_packing::no_variable_packing'
    public entry fun no_variable_packing(account: &signer) 
    acquires MyResource{
        let resource = borrow_global<MyResource>(signer::address_of(account));

        let k:u64 = 0;
        while (k < 10000) {
            let x8:  u8  = resource.x8;
            let x32: u64 = resource.x32;
            let x24: u64 = resource.x24;
            
            k = k + 1;
        };
    }
    // 746 Octa


    //aptos move run --function-id 'default::variable_packing::variable_storage'
    public entry fun variable_packing(account: &signer) 
    acquires MyPackedResource{
        let packed_resource = borrow_global<MyPackedResource>(signer::address_of(account));
        let x: u64 = packed_resource.x;

        let k:u64 = 0;
        while (k < 10000) {
            let x8  = (x & 0xF);
            let x32 = ((x & (0xFFFF << 8)) >> 8);
            let x24 = ((x & (0xFFF << 40)) >> 40);
            
            k = k + 1;
        };
    }
    // 630 Octa

}
```

### Resource Update

There is currently no incentive to deallocate global storage. Thus, in order to minimize gas consumption, unused resources should be overwritten rather
than deallocating and creating new resources.

```
module move_gas_optimization::resource_update {
    use std::signer;

    struct MyResource has key, store {
        a:u128,
        b:u128,
        c:u128,
        d:u128,
        vec: vector<u64>,
        w:u8,
        x:u8,
        y:u8,
        z:u8
    }


    //aptos move run --function-id 'default::resource_update::create_resource'
    public entry fun create_resource(account: signer) {
        let vec = vector::empty<u64>();
        let k:u64 = 0;
        while (k < 100) {
            vector::push_back(&mut vec, k);
            k = k + 1;
        };
        move_to<MyResource>(&account, MyResource {
                a:1000,
                b:1000,
                c:1000,
                d:1000,
                vec: vec,
                w:10,
                x:10,
                y:10,
                z:10
            });
    }
    

    //aptos move run --function-id 'default::resource_update::bad_resource_update' --args 'u8:1'
    public entry fun bad_resource_update(account: &signer, new_value: u8) 
    acquires MyResource{
        // transfer from global storage
        let resource = move_from<MyResource>(signer::address_of(account));

        // destroy
        let MyResource {
            a:a,
            b:b,
            c:c,
            d:d,
            vec: vec,
            w:w,
            x:_,
            y:y,
            z:z
        } = resource;

        // create new resource
        move_to<MyResource>(account, MyResource {
            a:a,
            b:b,
            c:c,
            d:d,
            vec: vec,
            w:w,
            x:new_value,
            y:y,
            z:z
        });
    }
    // 130 Octa


    //aptos move run --function-id 'default::resource_update::good_resource_update' --args 'u8:1'
    public entry fun good_resource_update(account: &signer, new_value: u8) 
    acquires MyResource{
        let resource = borrow_global_mut<MyResource>(signer::address_of(account));
        resource.x = new_value;
    }
    // 120 Octa

}
```

### Read Instead of Write

Writing to a resource is more expensive per byte than reading. Thus, a resource should only be written to if necessary.

```
module move_gas_optimization::read_instead_of_write {
    use std::signer;
    use std::vector;

    struct MyResource has key, store {
        a:u128,
        b:u128,
        c:u128,
        d:u128,
        vec: vector<u64>,
        w:u8,
        x:u8,
        y:u8,
        z:u8
    }


    //aptos move run --function-id 'default::read_instead_of_write::create_resource'
    public entry fun create_resource(account: signer) {
        let vec = vector::empty<u64>();
        let k:u64 = 0;
        while (k < 100) {
            vector::push_back(&mut vec, k);
            k = k + 1;
        };
        move_to<MyResource>(&account, MyResource {
                a:1000,
                b:1000,
                c:1000,
                d:1000,
                vec: vec,
                w:10,
                x:10,
                y:10,
                z:10
            });
    }


    //aptos move run --function-id 'default::read_instead_of_write::reading'
    public entry fun reading(account: &signer) 
    acquires MyResource{
        let k:u64 = 0;
        while (k < 1000) {
            let resource = borrow_global<MyResource>(signer::address_of(account));
            let x = resource.x;
            k = k + 1;
        };
    }
    // 44 Octa


    //aptos move run --function-id 'default::read_instead_of_write::writing'
    public entry fun writing(account: &signer) 
    acquires MyResource{
        let k:u64 = 0;
        while (k < 1000) {
            let resource = borrow_global_mut<MyResource>(signer::address_of(account));
            resource.x = 1;
            k = k + 1;
        };
    }
    // 3663 Octa

}

```

