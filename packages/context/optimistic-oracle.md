# Optimistic Oracle

An Optimistic Oracle is a type of oracle that assumes the data provided is correct unless it is challenged during a designated dispute period. In our case, we source data from multiple sources using the following approaches:

## Asset Price

- For asset prices, we calculate the average price by aggregating data from multiple trusted sources to ensure accuracy and reduce bias.

## Outcome Determination

- For specific outcomes (e.g., market predictions), we adopt a consensus approach, such as requiring at least 2 out of 3 data sources to agree on the outcome.

It is ideal for use cases like price feeds, prediction markets, and event-based smart contract triggers.
