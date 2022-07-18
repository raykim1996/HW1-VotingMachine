class ElectionCreatorHandler {
    constructor(address, web3) {
        // address of account connected via MetaMask
        this.address = address;
        // web3 instance
        this.web3 = web3;
        // abi, application binary interface to let MetaMask know the layout of the smart contract
        this.abi = JSON.parse('[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"_electionName","type":"string"},{"internalType":"string[]","name":"_candidates","type":"string[]"},{"internalType":"address[]","name":"_voters","type":"address[]"},{"internalType":"bytes","name":"_p","type":"bytes"},{"internalType":"bytes","name":"_g","type":"bytes"}],"name":"createElection","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllElections","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_electionName","type":"string"}],"name":"getElectionAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]');

        // from https://tools.ietf.org/html/rfc3526#page-3
        // hex value of safe prime
        this.pHex = 'ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff';
        this.pBigNum = new BigInteger(this.pHex, 16); // BigInteger instance of prime
        this.gBigNum = new BigInteger('2'); // BigInteger instance of generator 2
        this.contract = null; // connection to ElectionCreatorContract
    }

    // connect to ElectionCreatorContract
    async connect() {
        try {
            this.contract = await new this.web3.eth.Contract(this.abi, this.address);
        } catch(e) {
            throw 'connection failed';
        }
    }

    // Solidity wants 0x before hex strings, also standardize so each is 512 hex units long
    prepend0x(input) {
        let newInput = input;
        while(newInput.length < 512) {
            newInput = '0' + newInput;
        }
        newInput = '0x' + newInput;
        return newInput
    }

    // create an election with given parameters
    async create(electionName, candidates, voters, account) {
        if (this.contract == null) {
            throw 'Contract yet connected';
        }

        let electionReceipt = await this.contract.methods.createElection(electionName, candidates, voters, this.prepend0x(this.pBigNum.toString(16)), this.prepend0x(this.gBigNum.toString(16))).send({from: account});
        console.log(electionReceipt);
        let electionAddress = await this.contract.methods.getElectionAddress(electionName).call({from: account});
        console.log(`Election address is ${electionAddress}`);

        return electionAddress;
    }

    // Return values for prime p and generator g
    getPandG() {
        return [this.pBigNum.toString(), this.gBigNum.toString()];
    }
}