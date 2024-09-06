# Move Vector Limitations

In Move, vectors are a powerful tool for managing collections of data. However, a vector in Move cannot contain more than 1,000 entries. This constraint is imposed to ensure predictable resource usage and to avoid excessive consumption of computational and storage resources, which could lead to performance degradation or potential security risks.

## Considerations

* When designing smart contracts, it's important to keep in mind this limitation to prevent errors related to vector size.
* Use vectors only when the size is fixed such as for storing configurations. Avoid using them for ever-growing data like when wrapping other tokens.
* Always validate input and ensure that your code does not unintentionally exceed this limit to maintain the contract's reliability and stability.

