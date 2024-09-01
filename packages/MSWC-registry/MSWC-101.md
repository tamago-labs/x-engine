# Integer Overflow and Underflow

An overflow or underflow occurs when an arithmetic operation exceeds the maximum or minimum size of a type. For instance, if a number is stored in the u64 type, it means that the number is stored as a 64-bit unsigned number, ranging from 0 to 2^64-1.

## Remediation

It is recommended to use assertions to check the range of numbers before performing arithmetic operations throughout the smart contract system. This helps prevent overflow or underflow errors and ensures the calculations remain accurate and safe.

## Samples

The following are sample codes with potential threats. Filenames with the suffix _fixed refer to versions that show how to prevent these threats.

**integer_overflow_minimal.move**

```
module mswc_registry::integer_overflow_minimal {

  struct Global {
    count: u64
  }

  public fun run(global: &mut Global, input: u64) {
    global.count = global.count-input;
  }

}
```

**integer_overflow_minimal_fixed.move**

```
module mswc_registry::integer_overflow_minimal_fixed {

  const ERR_OVERFLOW_MINIMAL: u64 = 1;

  struct Global {
    count: u64
  }

  public fun run(global: &mut Global, input: u64) {
    assert!(global.count >= input, ERR_OVERFLOW_MINIMAL);
    global.count = global.count-input;
  }

}
```

**integer_overflow_mul.move**

```
module mswc_registry::integer_overflow_mul {

  struct Global {
    count: u64
  }

  public fun run(global: &mut Global, input: u64) {
    global.count = global.count*input;
  }

}
```

**integer_overflow_mul_fixed.move**

```
module mswc_registry::integer_overflow_mul_fixed {

  const U64_MAX: u64 = 18446744073709551615;
  const ERR_U64_OVERFLOW: u64 = 1;

  struct Global {
    count: u64
  }

  public fun run(global: &mut Global, input: u64) {
    assert!((global.count as u128) * (input as u128) < (U64_MAX as u128), ERR_U64_OVERFLOW);
    global.count = global.count*input;
  }

}
```



