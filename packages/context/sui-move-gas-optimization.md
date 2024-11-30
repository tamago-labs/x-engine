# Sui Move Gas Optimization

This article provides a guide for gas optimization in Sui Move smart contracts collected from several sources.

The gas used by a transaction consists of summing the gas associated with the size of its payload (payload gas), the virtual machine instructions it executes (instruction gas), and the global storage it accesses (storage gas):

- **Payload gas** - transaction size gas, the cost of publishing bytecode to the Sui blockchain.
- **Instruction gas** - the cost of performing a transaction on the Sui blockchain.
- **Storage gas** - the cost for writing and accessing Sui global storage resources.

 # Gas Optimization Patterns

This section provides both general principles and specific design patterns for optimizing gas consumption in Move smart contracts on Sui. Each principle is accompanied by an example smart contract demonstrating its application.

## Payload Gas Optimization

The gas associated with the payload is typically much less than the gas associated with instructions and global storage. Thus, for most applications, its contribution is negligible. However, if the payload greatly exceeds 600 bytes, then it may cause a noticeable increase due to Sui large transaction penalty. We give the following general principles for payload
gas optimization

### Minimize the Length of Modules 
The code of a published module is stored on the blockchain, which consumes gas. Minimizing the length of the module, i.e. the number of bytes required to store its bytecode, reduces the total gas cost.

### Minimize the Size of Parameters 
When executing a transaction script, the payload may contain the values of the parameters given by the user, which are stored on the blockchain and thus consumes gas. For example, combining many small functions that require a lot of parameters into one larger function, and also avoiding passing resources as parameters into functions.

## Instruction Gas Optimization

The gas associated with virtual machine instructions. In general, less virtual machine operations mean less gas consumption. However, this is not always possible without sacrificing the
necessary functionality. We give the following general principles for instruction gas optimization

### Minimize Vector Element Operations

Vector operations charge gas on a per-element basis, and are more expensive than operations on local variables. Thus, accessing vectors can be treated like accessing the global state.


**Bad Pattern - 94 MIST** 
```
    public entry fun bad_vector() {
        let mut vec = vector::empty<u64>();
        vector::push_back(&mut vec, 1);
        let mut k: u64 = 0;
        while (k < 1000) {
            k = k+*vector::borrow(&vec, 0);
        };
    }
```

**Good Pattern - 71 MIST**
```
    public entry fun good_vector() {
        let mut vec = vector::empty<u64>();
        vector::push_back(&mut vec, 1);
        let increment: u64 = *vector::borrow(&vec, 0);
        let mut k: u64 = 0;
        while (k < 1000) {
            k = k+increment;
        };
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
    // 2372 MIST


    //aptos move run --function-id 'default::short_circuit::short_circuit'
    public entry fun short_circuit() {
        if (cheap_function() && expensive_function()) {

        };
    }
    // 200 MIST

}
```
