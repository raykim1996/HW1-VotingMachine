class App {
    constructor() {
        this.ui = new UI();
        this.processor = new Processor();
        this.electionHandler = null;
    }

    async connectMetamask() {
        let connectedAccount = await this.processor.connectMetamask();
        if (connectedAccount == null) {
            return;
        }

        this.ui.setupConnectToElection(connectedAccount);
    }

    async connectContract() {
        this.ui.startSpinner();
        this.electionHandler = new ElectionHandler(this.processor.account, this.processor.web3, this.ui.getContractAddress());
        await this.electionHandler.connect();
        console.log('connected!');
        console.log('got round');

        this.ui.showElectionAddress(this.electionHandler.address);
        let round = await this.electionHandler.getRound();
        if (round == 1) {
            if (this.electionHandler.hasSubmittedPK) {
                this.ui.setupRound1(this.electionHandler.getPStr(), this.electionHandler.getGStr(), false);
            } else {
                this.ui.setupRound1(this.electionHandler.getPStr(), this.electionHandler.getGStr(), true);
            }
            this.ui.displayCandidates(this.electionHandler.getCandidates(), false);
            console.log(`initialized round 1`);
        } else if (round == 2) {
            this.ui.setupRound1(this.electionHandler.getPStr(), this.electionHandler.getGStr(), false);
            this.ui.displayCandidates(this.electionHandler.getCandidates(), false);
        } else if (round == 3) {
            this.ui.setupRound3();
            this.ui.displayCandidates(this.electionHandler.getCandidates(), false);
        } else if (round == 4) {
            this.ui.displayCandidates(this.electionHandler.candidates, false);
            await this.doFinishedState();
        }

        this.ui.stopSpinner();
    }

    async switchToVoting() {
        let canIVote = await this.electionHandler.canVote();
        if (canIVote) {
            this.ui.displayCandidates(this.electionHandler.candidates, true);
            this.ui.setCanVoteStatus(true);
        } else {
            this.ui.setCanVoteStatus(false);
            this.ui.displayCandidates(this.electionHandler.candidates, false);
        }
    }

    async setupPK() {
        console.log('setting up pk');
        this.ui.startSpinner();
        console.log(this.electionHandler.hasSubmittedPK);
        if (this.electionHandler.hasSubmittedPK) {
            let x = this.ui.getSecretXInput();
            this.electionHandler.reestablishPK(x);
            this.ui.round1Update(x, this.electionHandler.pk);
        } else {
            console.log('hello???');
            let [x, pk] = this.electionHandler.generatePK();
            let [gv, r] = await this.electionHandler.generateZKProofPK();
            let receipt = await this.electionHandler.submitPK();
            this.ui.round1Update(x, this.electionHandler.pk);
        }
        let round = await this.electionHandler.getRound();
        if (round == 2) {
            await this.switchToVoting();
        } else {
            this.ui.displayCandidates(this.electionHandler.candidates, false);
        }
        this.ui.stopSpinner();
    }

    async calculateWinner() {
        await this.electionHandler.determineElectionWinner();
        this.doFinishedState();
    }

    async doFinishedState() {
        let candidates = this.electionHandler.getCandidates();
        let finalVotes = await this.electionHandler.getFinalVotes();
        let winner = await this.electionHandler.getWinner();
        this.ui.setupFinishedState(winner);
        this.ui.displayCandidates(candidates, false, finalVotes, winner);
    }

    async vote(candidateIndex) {
        this.ui.startSpinner();
        let result = await this.electionHandler.vote(candidateIndex);

        let round = await this.electionHandler.getRound();
        if (round == 3) {
            this.ui.setupRound3();
            this.ui.displayCandidates(this.electionHandler.getCandidates());
        } else if (round == 4) {
            this.doFinishedState();
        } else {
            this.ui.displayCandidates(this.electionHandler.getCandidates());
        }
        this.ui.stopSpinner();
    }
}

let app = new App();