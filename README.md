# Lottery Smart Contract with Age Check zkSNARKs ZoKrates

This project is a lottery smart contract that uses zkSNARKs to verify the age of participants. The age check is done using ZoKrates, a toolbox for zkSNARKs on Ethereum.

## Project Structure

The project is structured as follows:

- `contracts/`: Contains the Solidity smart contracts for the lottery.
- `deploy/`: Contains the deployment scripts for the smart contracts.
- `deployments/`: Contains the deployment outputs for the smart contracts.
- `scripts/`: Contains scripts for deploying and interacting with the smart contracts.
- `test/`: Contains the test scripts for the smart contracts.
- `ZoKrates/`: Contains the ZoKrates code for the age check.

## Prerequisites

- Node.js and npm installed
- Hardhat installed globally (`npm install -g hardhat`)

## Setup

1. Clone the repository and navigate into the project directory

2. Install the project dependencies with `npm install`

## Compile Contracts

Run `npx hardhat compile` to compile the Solidity contracts.

## Run Tests

Run `npx hardhat test` to execute the test scripts.

## Deploy Contracts

1. Update the `hardhat.config.ts` file with your network details

2. Run `npx hardhat run scripts/deploy.ts --network <network_name>` to deploy the contracts to the specified network.

## ZoKrates Setup

1. Navigate into the ZoKrates directory with `cd ZoKrates`

2. Build ZoKrates with the following commands

3. Build ZoKrates

```shell
cd ZoKrates
export ZOKRATES_STDLIB=$PWD/zokrates_stdlib/stdlib
cargo +nightly build --release
```
4. Creates ageCheck.zok

```shell
cd target/release
mkdir code
cd code && touch ageCheck.zok
```

5. Configure the ageCheck.zok
```shell
def main(private field birthYear, field comparisonYear, field minimumDifference) -> bool{
    bool result = comparisonYear - birthYear >= minimumDifference;
    return result;
}
```

6. Execute all in zoKrates

```shell
./zokrates compile -i code/ageCheck.zok
./zokrates setup
./zokrates compute-witness -a 1990 2020 18
./zokrates generate-proof
./zokrates export-verifier
```
7. Deploy Lottery Smart Contract in localhost or live network

```shell
npx hardhat deploy --network <blockchain-network> --tags Lottery
```
8. Paste Proof and Input Generated in enterLottery()

```shell
proof.txt
```

![tx](https://github.com/eludius18/zkSNARKs-ZoKrates-ageCheck/blob/main/tx.png)
