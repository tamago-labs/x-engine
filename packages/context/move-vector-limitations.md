# Move Vector Limitations

In Move, vectors are a powerful tool for managing collections of data. However, a vector in Move cannot contain more than 1,000 entries. This constraint is imposed to ensure predictable resource usage and to avoid excessive consumption of computational and storage resources, which could lead to performance degradation or potential security risks.

## Considerations

* When designing smart contracts, it's important to keep in mind this limitation to prevent errors related to vector size.
* Use vectors only when the size is fixed such as for storing configurations. Avoid using them for ever-growing data, such as when wrapping other tokens, fractionalizing NFTs or managing collateral debt positions.
* When necessary, you can use an extended vector library from each network, as seen in the sample section.

## Samples

The following are sample codes with potential threats. Filenames with the suffix _fixed refer to versions that show how to prevent these threats.

**sui_vector.move**

```
module mswc_registry::sui_vector {

  struct FractionalizeNFT {
    items: vector<NFT>
  }

  public entry fun mint(fnft: &mut FractionalizeNFT, item: NFT) {
    vector::push_back( &mut fnft.items, item );
  }
}
```

**sui_vector_fixed.move**

Replace `vector` with `TableVec` for Sui source code. 

```
module mswc_registry::sui_vector_fixed {

  use sui::table_vec::{Self, TableVec};

  struct FractionalizeNFT {
    items: TableVec<NFT>
  }

  public entry fun mint(fnft: &mut FractionalizeNFT, item: NFT) {
    table_vec::push_back( &mut fnft.items, item );
  }
}
```


**aptos_vector.move**

```
module mswc_registry::aptos_vector {

  struct FractionalizeNFT {
    items: vector<NFT>
  }

  public entry fun mint(fnft: &mut FractionalizeNFT, item: NFT) {
    vector::push_back( &mut fnft.items, item );
  }
}
```

**aptos_vector_fixed.move**

Replace `vector` with `SmartVector` for Aptos source code. 

```
module mswc_registry::aptos_vector_fixed {

  use aptos_std::smart_vector::{Self, SmartVector};

  struct FractionalizeNFT {
    items: SmartVector<NFT>
  }

  public entry fun mint(fnft: &mut FractionalizeNFT, item: NFT) {
    smart_vector::push_back( &mut fnft.items, item );
  }
}
```

