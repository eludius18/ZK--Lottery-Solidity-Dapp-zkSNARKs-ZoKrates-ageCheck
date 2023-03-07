# Age Check zkSNARKs ZoKrates
## Build ZoKrates

```shell
cd ZoKrates
cargo +nightly build --release
```
## Creates ageCheck.zok

```shell
cd target/release
mkdir code
cd code && touch ageCheck.zok
```

## ageCheck.zok
```shell
def main(private field birthYear, field comparisonYear, field minimumDifference) -> bool{
    bool result = comparisonYear - birthYear >= minimumDifference;
    return result;
}
```

## Execute all in zoKrates

```shell
./zokrates compile -i code/ageCheck.zok
./zokrates setup
./zokrates compute-witness -a 1990 2020 18
./zokrates generate-proof
./zokrates export-verifier
```
## Deploy Lottery Smart Contract

```shell
npx hardhat deploy --network <blockchain-network> --tags Lottery
```

## Paste Proof and Input Generated in enterLottery()

```shell
proof.txt
```

![tx](https://github.com/eludius18/zkSNARKs-ZoKrates-ageCheck/blob/main/tx.png)
