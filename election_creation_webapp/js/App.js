class App {
    constructor() {
        this.ui = new UI();
        this.processor = new Processor();
        this.electionCreatorContract = null;
    }

    // Connect to MetMask to connect to user's address to interact/deploy smart contract
    async connectMetamask() {
        let connectedAccount = await this.processor.connectMetamask();
        if (connectedAccount == null) {
            alert('Could not conenct to your MetaMask account');
            return;
        }

        // change the UI to reflect result
        this.ui.setupConnectToElectionCreator(connectedAccount);
    }

    // Setup the ElectionCreatorHandler
    async connectToElectionCreator() {
        this.ui.startSpinner(); // UI spinner start
        this.electionCreatorContract = new ElectionCreatorHandler(this.ui.getElectionCreatorAddress(), this.processor.web3);
        await this.electionCreatorContract.connect();
        this.ui.stopSpinner();  // UI spinner stop
        console.log('connected to election creator');

        // change UI
        this.ui.setupElectionParams();
    }


    // create an election
    async createElection() {
        this.ui.startSpinner();
        let candidates = this.processor.seperateCommas(this.ui.getCandidates()); // get candidates from UI and clean them
        let voters = this.processor.seperateCommas(this.ui.getVoters()); // get voters from UI and clean them
        let electionName = this.ui.getElectionName(); // get election name
        let electionAddress = await this.electionCreatorContract.create(electionName, candidates, 
                voters, this.processor.account); // create election and get election address
        let [p, g] = this.electionCreatorContract.getPandG(); // get prime p and generator g
        // update UI
        this.ui.showCompleted(electionName, candidates, voters, p, g, electionAddress);

        this.ui.stopSpinner();
    }
}

let app = new App();