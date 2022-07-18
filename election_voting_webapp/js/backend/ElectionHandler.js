
class ElectionHandler {
    constructor(account, web3, address) {
        this.account = account; // Ethereum account that is connected via MetaMask
        this.web3 = web3; // web3 instance
        this.address = address; // address of the AnonymousElection
        // abi is essentially outline of AnonymousElection.sol to show what methods and variables are available to MetaMask
        this.abi = JSON.parse('[{"inputs":[{"internalType":"string[]","name":"_candidates","type":"string[]"},{"internalType":"address[]","name":"_voters","type":"address[]"},{"internalType":"bytes","name":"_p","type":"bytes"},{"internalType":"bytes","name":"_g","type":"bytes"},{"internalType":"address","name":"_owner","type":"address"},{"internalType":"string","name":"_name","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"bytes","name":"_gv","type":"bytes"},{"internalType":"bytes","name":"_pk","type":"bytes"},{"internalType":"address","name":"_a","type":"address"}],"name":"calculatePKHash","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"canIVote","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllPK","outputs":[{"internalType":"bytes[]","name":"","type":"bytes[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllVotes","outputs":[{"internalType":"bytes[]","name":"","type":"bytes[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCandidates","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getG","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getM","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getP","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getVoters","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"hasSubmittedPK","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"}],"name":"hasSubmittedVote","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"_pk","type":"bytes"},{"internalType":"bytes","name":"_gv","type":"bytes"},{"internalType":"bytes","name":"_r","type":"bytes"}],"name":"submitPK","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"_encVote","type":"bytes"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"}]');

        this.contract = null;
        this.candidates = [];
        this.voters = []; // array of voter addresses
        this.allPK = []; // array of all voters' public keys
        this.round = 0; // what is the current round of the election
        this.g = null; // Generator g
        this.p = null; // Prime p
        this.secretX = null; // User's secret key x
        this.allPK = null;
        this.canIVote = null;
        this.hasSubmittedVote = null;
        this.hasSubmittedPK = null;
    }
    // jsbn.js doesn't like the 0x in front of hex, but the solidity library does
    prepend0x(input) {
        let newInput = input;
        while(newInput.length < 512) {
            newInput = '0' + newInput;
        }
        newInput = '0x' + newInput;
        return newInput
    }

    // jsbn.js doesn't like the 0x in front of hex, but the solidity library does
    remove0x(input) {
        return input.slice(2);
    }

    // Connect to AnonymousElection at given address
    async connect() {
        this.contract = await new this.web3.eth.Contract(this.abi, this.address); // connect to contract
        console.log(this.contract);

        this.round = await this.contract.methods.getRound().call({from: this.account}); // get current round
        console.log(`Election Round: ${this.round}`);

        this.candidates = await this.contract.methods.getCandidates().call({from: this.account});
        console.log(`Election Candidates: ${this.candidates}`);

        this.canIVote = await this.contract.methods.canIVote(this.account).call({from: this.account}); // see if you can vote
        console.log(`Can I vote: ${this.canIVote}`);

        this.voters = await this.contract.methods.getVoters().call({from: this.account}); // get all the voters
        console.log(`Voters: ${this.voters}`);

        let pBytes = await this.contract.methods.getP().call({from: this.account}); // get the Prime p value
        this.p = new BigInteger(this.remove0x(pBytes), 16);
        console.log(`Election prime p: ${this.p.toString()}`);

        let gBytes = await this.contract.methods.getG().call({from: this.account}); // get the generator g value
        this.g = new BigInteger(this.remove0x(gBytes), 16);
        console.log(`Election generator g: ${this.g.toString()}`);

        this.m = await this.contract.methods.getM().call({from: this.account}); // get the m value, 2^m > length(voters)
        this.mBigNum = new BigInteger(this.m.toString());
        console.log(`Election m: ${this.m.toString()}`);

        // check if has submitted PK already
        this.hasSubmittedPK = await this.contract.methods.hasSubmittedPK(this.account).call({from: this.account});
        console.log(`Have I submitted by pk: ${this.hasSubmittedPK}`);

        // check if user has already submitted their vote
        this.hasSubmittedVote = await this.contract.methods.hasSubmittedVote(this.account).call({from: this.account});
        console.log(`Have I submitted my vote: ${this.hasSubmittedVote}`);
        console.log('connected');
    }


    // get the current round of election
    async getRound() {
        this.round = await this.contract.methods.getRound().call({from: this.account});
        return this.round;
    }

    // get whether the current user can vote
    async canVote() {
        this.canIVote = await this.contract.methods.canIVote(this.account).call({from: this.account});
        return this.canIVote;
    }

    getCandidates() {
        return this.candidates;
    }

    getPStr() {
        return this.p.toString();
    }

    getGStr() {
        return this.g.toString();
    }

    // used for when user already knows their secret on round > 1
    reestablishPK(secretX) {
        this.secretX = new BigInteger(secretX.toString());
        this.pk = this.g.modPow(this.secretX, this.p);
    }


    // Generate the public key from the prime p and generator g
    generatePK() {
        console.log('generating pk for first time');
        let pStr = this.p.toString();
        let secretXStr = '';
        for (let i = pStr.length - 200; i > 0; i--) {
            secretXStr = secretXStr + (Math.floor(10 * Math.random())).toString();
        }
        this.secretX = new BigInteger(secretXStr);
        if (this.secretX.toString() == '0' || this.secretX.toString() == '1') {
            this.secretX = new BigInteger('2');
        }
        this.pk = this.g.modPow(this.secretX, this.p);
        console.log(`Secret x is ${this.secretX}`);
        console.log(`PK is ${this.pk}`);

        return [this.secretX.toString(), this.pk.toString()];
    }


    // Not used, but may be used in future updates
    async generateZKProofPK() {
        // setup proof of pk
        console.log('Setting up ZK proof for pk');

        let pStr = this.p.toString();
        let vStr = '';
        for (let i = pStr.length - 4; i > 0; i--) {
            vStr = vStr + (Math.floor(10 * Math.random())).toString();
        }
        if (vStr.toString() == '0' || vStr.toString() == '1') {
            vStr = new BigInteger('2');
        }

        let v = new BigInteger(vStr);
        while(v.toString().length < this.secretX.toString().length) {
            v = v.multiply(new BigInteger('100000000000000000000000000000000000000000000000000000000000000000000000000'));
        }
        this.gv = this.g.modPow(v, this.p);
        console.log('Getting z hash');
        let zBytes =  await this.contract.methods.calculatePKHash(this.prepend0x(this.gv.toString(16)), this.prepend0x(this.pk.toString(16)), this.account).call({from: this.account});
        let z = new BigInteger(this.remove0x(zBytes), 16);
        console.log(`z = ${z.toString()}`);

        this.r = v.subtract((this.secretX.multiply(z)));

        console.log(`g^v=${this.gv.toString()}, r=${this.r.toString()}`)

        return [this.gv, this.r]
    }


    // Submit the PK to smart contract
    async submitPK() {
        console.log('Submitting pk');
        console.log(`Submitting pk: ${this.prepend0x(this.pk.toString(16))}`);
        console.log(`Submitting gv zero knowledge: ${this.prepend0x(this.gv.toString(16))}`);
        console.log(`Submitting r zero knowledge: ${this.prepend0x(this.r.toString(16))}`);
        let receipt = await this.contract.methods.submitPK(this.prepend0x(this.pk.toString(16)), this.prepend0x(this.gv.toString(16)), this.prepend0x(this.r.toString(16))).send({from: this.account});
        console.log(receipt);
    }


    // Calculate encrypted vote and submit the vote
    async vote(candidateIndex) {
        console.log('getting all pks');
        let pks = await this.contract.methods.getAllPK().call({from: this.account});
        console.log(pks);

        // calculate g^y
        let isInv = false;
        let encVote = new BigInteger('1'); // identity for multiplication
        for (let i = 0; i < this.voters.length; i++) {
            let otherPK = new BigInteger(this.remove0x(pks[i]), 16);
            console.log(`pk ${i} is ${otherPK}`);
            if (this.voters[i].toLowerCase() == this.account.toLowerCase()) {
                isInv = true; // now we will multiply by modInverse
                continue; // don't include voter's pk in g^(y)
            }
            if (isInv) { // should we modInverse
                let modInv = otherPK.modInverse(this.p);
                encVote = encVote.multiply(modInv);
                encVote = encVote.mod(this.p);
            } else {
                encVote = encVote.multiply(otherPK);
                encVote = encVote.mod(this.p);
            }
        }
        console.log(`g^y = ${encVote}`);
        encVote = encVote.modPow(this.secretX, this.p); // = (g^y)^x = (g^(xy))
        console.log(`g^(xy) = ${encVote}`);

        // calculate v, the vote portion
        let vi = new BigInteger('2'); // v = 2
        vi = vi.pow((new BigInteger((candidateIndex * this.m).toString()))); // v = 2^(candidateIndex * m)
        console.log(`vi is ${vi}`);
        
        // calculate final encrypted vote
        encVote = encVote.multiply(this.g.modPow(vi, this.p)); // = g(^xy)g^(v)
        encVote = encVote.mod(this.p); // = g^(xy)g^(v) mod p, our encrypted vote
        console.log(`encrypted vote: ${encVote}`);
        
        // send vote to the smart contract
        let receipt = await this.contract.methods.vote(this.prepend0x(encVote.toString(16))).send({from: this.account});
        console.log(receipt);
    }

    // check if potential vote breakup, when put in encrypted form, is equal to the encrypted votes
    checkSum(voteBreakup, encVotesVal) {
        let gBig = this.g;
        let potentialSum = new BigInteger('0'); // g^(2^(0)c1 + 2^(m)c2 + ... + 2^((n-1)*m)cn) for n=number of candidates
        for (let i = 0; i < voteBreakup.length; i++) {
            let twoToM = new BigInteger('2');
            twoToM = twoToM.pow(new BigInteger((i*this.m).toString()));
            let voteBN = new BigInteger(voteBreakup[i].toString());
            potentialSum = potentialSum.add((voteBN.multiply(twoToM)));
        }
        let potentialVoteVal = gBig.modPow(potentialSum, this.p);
        console.log(`checking if [${voteBreakup}] = ${potentialVoteVal}}`);
        return encVotesVal.equals(potentialVoteVal);
    }

    // take all the votes and determine the final encrypted vote value by mod multiplying them together
    calculateEncryptedVotes(voteArray) {
        let encryptedVoteVal = new BigInteger('1');
        for (let i = 0; i < voteArray.length; i++) {
            let voteBI = new BigInteger(this.remove0x(voteArray[i]), 16);
            console.log(`Vote ${i}: ${voteBI.toString()}`);
            encryptedVoteVal = (encryptedVoteVal.multiply(voteBI)).mod(this.p);
        }
        return encryptedVoteVal;
    }


    // find the winner of this election
    async determineElectionWinner() {
        console.log(`Getting all encrypted votes`);
        let allVotes = await this.contract.methods.getAllVotes().call({from: this.account});
        console.log(allVotes);
        let encVotesVal = this.calculateEncryptedVotes(allVotes);
        console.log(`Encrypted votes: ${encVotesVal.toString()}`);

        let numVotes = this.voters.length;
        console.log(`Num Votes: ${numVotes}`);

        let voteBreakup = [];
        for (let x in this.candidates) {
            voteBreakup.push(0);
        }
        voteBreakup[0] = numVotes;

        let keepGoing = true;
        while(!(voteBreakup[voteBreakup.length - 1] > numVotes) && keepGoing) {
            console.log(`Checking vote breakup`);
            console.log(voteBreakup);
            if (this.checkSum(voteBreakup, encVotesVal)) { // if this is the correct breakup
                console.log(`Correct breakup found: ${voteBreakup}`);
                this.voteBreakup = voteBreakup;

                // find the winner
                this.winner = '';
                this.winnerVotes = -1;
                for (let z = 0; z < this.voteBreakup.length; z++) {
                    if (this.voteBreakup[z] > this.winnerVotes) {
                        this.winner = this.candidates[z];
                        this.winnerVotes = this.voteBreakup[z];
                    }
                }

                // check if there is a tie
                for (let z = 0; z < this.voteBreakup.length; z++) {
                    if (this.voteBreakup[z] == this.winnerVotes && this.candidates[z] != this.winner) {
                        console.log(`There is a tie`);
                        this.winner = 'There is a tie';
                    }
                }

                return voteBreakup;
            }
            // break out of the loop if we've reached the end
            if (voteBreakup[voteBreakup.length - 1] == numVotes) {
                keepGoing = false;
                break;
            }

            let i = voteBreakup.length - 1;
            while (voteBreakup[i] == 0) {
                i--;
            }
            if (i == voteBreakup.length - 1) {
                let addBack = voteBreakup[i];
                voteBreakup[i] = 0;
                let j = i;
                while(voteBreakup[j] == 0) {
                    j--;
                }
                voteBreakup[j]--;
                voteBreakup[j+1] = addBack + 1;
            } else {
                voteBreakup[i]--;
                voteBreakup[i+1]++;
            }
        }
        // :((( I thought the voters were honest
        console.error(`no breakup found?????!!!`);
        alert('No vote breakup found');
        throw 'no vote breakup found';
    }

    async getFinalVotes() {
        console.log('Getting final votes');
        return this.voteBreakup;
    }

    async getWinner() {
        return this.winner;
    }
}