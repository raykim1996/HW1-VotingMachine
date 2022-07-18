pragma solidity >=0.8.0 <0.9.0;

import "./AnonymousElection.sol";

contract AnonymousElectionCreator {
    // Who is the owner of this election creator?
    string name;
    // TODO: instantiate the address of the owner of the election.
    address private owner;

    // TODO: create a mapping of the election name string to the election address.
    mapping(string => address) private electionName2Address;

    // TODO: create an array of strings of the names of elections.
    string[] private electionsList;

    // Create the constructor.
    constructor() {
        // TO DO: instantiate the "owner" as the msg.sender.
        owner = msg.sender;
        // TO DO: instantiate the election list.
        electionsList = new string[](0);
    }


    // Write the function that creates the election:
    function createElection(string memory _electionName, string[] memory _candidates, address[] memory _voters, bytes memory _p, bytes memory _g) public returns(address) {
        // make sure that the _electionName is unique
        // TODO: use the solidity require function to ensure the election name is unique. "Election name not unique. An election already exists with that name."
        require(electionName2Address[_electionName] == address(0), "Make electionName unique!");

        // TODO: use the solidity require function to ensure "candidate list and voter list both need to have non-zero length, >1 candidate."
        require(_candidates.length > 1, "We need more than 1 candidate!");
        require(_voters.length > 0, "We need more than 0 voter!");

        // TODO: Using a for loop, require none of the candidates are the empty string.
        for (uint256 i = 0; i < _candidates.length; i++) {
            bytes memory emptyStringTest = bytes(_candidates[i]);
            require(emptyStringTest.length != 0, "One of the candidates is an Empty String!");
        }

        // TODO: Create a new election.
        AnonymousElection newElection = new AnonymousElection(_candidates, _voters, _p, _g, owner, _electionName);

        // TODO: Create a mapping between _electionName and election address.
        electionName2Address[_electionName] = address(newElection);

        // TODO: Use .push() to add name to electionsList
        electionsList.push(_electionName);

        // TODO: return the address of the election created
        return address(newElection);
    }

    // return address of an election given the election's name
    function getElectionAddress(string memory _electionName) public view returns(address) {
        // TODO: Using the solidity require function, ensure that _electionName is a valid election.
        require(electionName2Address[_electionName] != address(0), "Current Election Name is not valid!");

        // TODO: Return the address of requested election.
        return electionName2Address[_electionName];
    }

    // return list of all election names created with this election creator
    function getAllElections() public view returns (string[] memory){
        return electionsList;
    }
}
