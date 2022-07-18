
# ethereum-anonymous-voting

Smart contract project for anonymous voting on the Ethereum blockchain.
Assumes honest-but-curious voters, malicious outsiders

### This project is divided into three distinct parts:
 1. **./contracts/**
		 Contains the Solidity code for the smart contracts relevant to this project. Specifically `AnonymousElectionCreator.sol` which creates anonymous election smart contracts given the necessary parameters and `AnonymousElection.sol` which is an anonymous election smart contract that voters interact with
 3. **./election_creation_webapp/**
		 A webapp for creating Anonymous Elections via the `AnonymousElectionCreator.sol` contract
 4. **./election_voting_webapp/**
		A webapp for voters to interact with `AnonymousElection.sol` smart contracts
  

## election_creation_webapp
This webapp allows for the creation of **Anonymous Elections** as detailed in `AnonymousElection.sol`
This webapp, through **[MetaMask](https://metamask.io/)**, connects to an instance of `AnonymousElectionCreator.sol` on an Ethereum blockchain.
Election Officials can create anonymous elections by specifying the election name, voters' addresses, and candidate names. Then by giving the address of resultant Anonymous Election smart contract created to the allowed voters, the voters can use the election_voting_webapp to vote and interact with the election.

### How to Use
 1. Ensure your browser has MetaMask installed and is connected to some Ethereum blockchain (the mainnet, ropsten network, local ganache network). 
 2. Deploy an instance of `AnonymousElectionCreator.sol` on the blockchain. This can be done by going to https://remix.ethereum.org/ uploading the code and deploying. Make special note of the Contract's address once finished (contract's address, not transaction hash)
 3. Open `index.html` in any local server. Ensure your MetaMask instance is connected to the same blockchain as the one which you deployed `AnonymousElectionCreator.sol`
 4. Click the connect to MetaMask button. Accept whatever MetaMask popup shows up if one does
 5. Enter the Address of your deployed contract
 6. Enter the information for your election (name of the election, addresses of the voters, candidate names)
 7. Submit and the MetaMask popup to deploy
 8. Save the information of the election that is shown to you, **especially the election contract address!**
  
  

## election_voting_webapp
This webapp allows voters to interact with `AnonymousElection.sol` smart contract instances on Ethereum networks. 
This webapp, through **[MetaMask](https://metamask.io/)**, connects to an instance of `AnonymousElectionCreator.sol` on an Ethereum blockchain.

### How to Use
 1. Ensure your browser has MetaMask installed and is connected to the same Ethereum network as the election is on. 
 2. Open `index.html` in any local server.
 3. Click the connect to MetaMask button. Accept whatever MetaMask popup shows up if one does
 4. Enter the Address of the already created Anonymous Election and connect
 5. Click the setup button to setup your public key cryptography and send it to the contract. **Save your secret key *x* (necessary!!!)**
 6. Await until everyone else has also setup their public key cryptography. Refresh the page.
 7. Reconnect to the same election, submit your saved secret key, and then click the vote button to vote for who you want to vote for
 8. Wait until everyone else has voted. Refresh the page.
 9. Reconnect to the same election. Click the calculate vote button. You will then be shown the winner (if there is not a tie) and how many votes each person got


## Credits
Filecoin Foundation and co:rise would like to thank Elijah Jasso, University of Pennsylvania alumn and software engineer at Coinbase, for authoring and contributing this assignment!

**Algorithms, Cryptography and Inspiration**

 - Hao, F., Ryan, P., & Zielinski, P. (2010). Anonymous voting by two-round public discussion. *Information Security, IET, 4, 62 - 67.*

**Webapp**
- Milligram (CSS-framework) https://milligram.io/
- css-loader https://github.com/raphaelfabeni/css-loader
- Food Icons made by [Freepik](https://www.flaticon.com) from [www.flaticon.com](https://www.flaticon.com/)
- jsbn.js (JavaScript Big Integer Library) https://github.com/andyperlitch/jsbn
