class Processor {
    constructor() {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
        } else {
            alert('To use this webapp please install MetaMask');
        }
        
        this.account = null;
        this.web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        this.electionHandler = null;
        this.isAccountConnected = false;
    }

    async connectMetamask() {
        try {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.account = accounts[0];
            console.log('attempt succesful');
            this.isAccountConnected = true;
        }
        catch(err) {
            alert("error connecting");
            console.error(err);
            return null;
        }
        return this.account;
    }
}




// let account = null;
// let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
// let electionCreatorHandler = null;
// let electionHandler = null

// async function createElection(electionNameID, numVotesID, votersID, candidatesID) {
//     if (account == null) {
//         alert('Please connect account first');
//         return;
//     }

//     let electionName = document.getElementById(electionNameID).value;
//     let numVotes = Number(document.getElementById(numVotesID).value);

//     let votersString = document.getElementById(votersID).value;
//     let voters = votersString.replaceAll(' ', '').split(',');

//     let candidatesString = document.getElementById(candidatesID).value;
//     let candidates = candidatesString.replaceAll(' ', '').split(',');
// }

// async function connectMetamask() {
//     try {
//         ui.startSpinner();
//         let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         ui.stopSpinner();
//         account = accounts[0];
//         console.log('attempt succesful');
//         isAccountConnected = true;
//     }
//     catch(err) {
//         alert("error connecting");
//         console.error(err);
//         return;
//     }

//     electionCreator = new ElectionCreatorHandler(account, web3);
//     ui.advanceStage('connectMetamask');
// }

// async function connectToElection() {
//     let electionID = ui.getElectionID();
// }



// async function testContractConnection(inputId) {
//     if (!isAccountConnected) {
//         alert('Please connect your account first');
//         return;
//     }
//     console.log('connecting to contract');
//     contract = await new web3.eth.Contract(test_contract_abi, document.getElementById(inputId).value);
//     console.log(`connected to contract ${contract}`);

//     try {
//         let result = await contract.methods.getTestString().call({from: account});
//         console.log(result);
//         let result2 = await contract.methods.isOwner(account).call({from: account});
//         console.log(`isOwner with ${account} returns ${result2}`);
//     } catch(err) {
//         alert('Could not connect to contract. Please ensure address is correct');
//         console.error(err);
//     }

//     isContractConnected = true;

// }