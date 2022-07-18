// Class that modifies the frontend
class UI {
    constructor() {
        this.spinnerOverlay = document.getElementById('spinner-overlay');
        this.stopSpinner(200);

        this.metaMaskDiv = document.getElementById('metamask-div');
        this.showElem(this.metaMaskDiv);

        this.electionConnectionDiv = document.getElementById('election-connection-div');
        this.hideElem(this.electionConnectionDiv);

        this.round1Div = document.getElementById('round1-div');
        this.hideElem(this.round1Div);

        this.round3Div = document.getElementById('round3-div');
        this.hideElem(this.round3Div);

        this.round4Div = document.getElementById('round4-div');
        this.hideElem(this.round4Div);

        this.candidatesDiv = document.getElementById('candidates-div');
        this.hideElem(this.candidatesDiv);
    }

    startSpinner() {
        this.spinnerOverlay.classList.add('is-active');
    }

    stopSpinner(t = 300) {
        setTimeout(() => {
            this.spinnerOverlay.classList.remove('is-active');
        }, t);
    }

    hideElem(elem) {
        elem.classList.add('invisible');
    }

    showElem(elem) {
        elem.classList.remove('invisible');
    }

    setupConnectToElection(account) {
        this.hideElem(this.metaMaskDiv);
        this.showElem(this.electionConnectionDiv);
        document.getElementById('connected-account-header').innerHTML = `Connected to MetaMask Account: <b>${account}</b>`;
    }

    getContractAddress() {
        return document.getElementById('contract-address-input').value;
    }

    showElectionAddress(address) {
        document.getElementById('connected-address-header').innerHTML = `Election Address: <b>${address}</b>`;
    }

    setupRound1(p, g, isNew) {
        document.getElementById('p').innerHTML = p;
        document.getElementById('g').innerHTML = g;
        if (isNew) {
            this.hideElem(document.getElementById('reestablish-secret-div'));
        } else {
            this.showElem(document.getElementById('reestablish-secret-div'));
        }
        this.showElem(this.round1Div);
    }

    round1Update(x, pk) {
        document.getElementById('secret-x').innerHTML = x;
        document.getElementById('pk').innerHTML = pk;
        this.hideElem(document.getElementById('round1-button'));
    }

    // This takes the name of a candidate and outputs a value between 1 and 37, meant for use with profile pictures
    simpleImageNumberHash(candidateName) {
        let num = 0;
        for (let i = 0; i < candidateName.length; i++) {
            num += candidateName.charCodeAt(i);
        }
        return (num % 50) + 1;
    }

    generateCard(candidateName, candidateIndex, canVoteNow, voteNum, isWinner, size=25) {
        return `
            <div class="column column-${size}">
                <div class="card">
                    <img src="img/food/food (${this.simpleImageNumberHash(candidateName)}).png" alt="Avatar" style="width:100%">
                    <div class="container">
                        <h4><b>${candidateName}</b> ${isWinner ? '&#11088;' : ''}</h4>
                        <h6>Votes: ${voteNum}</h6>
                        ${ canVoteNow ? '<button onclick="app.vote(' + candidateIndex + ')">Vote</button>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    displayCandidates(candidates, canVoteNow = false, votes = null, winner = null) {
        this.hideElem(this.electionConnectionDiv);
        let candidateGrid = '';

        let size = (candidates.length < 4) ? 33 : 25;

        for (let i = 0; i < Math.ceil(candidates.length / 4); i++) {
            candidateGrid += '<div class="row">';
            for (let j = 0; j < 4 && i*4 + j < candidates.length; j++) {
                let index = i*4 + j;
                let voteNum = (votes == null ? 'not available' : votes[index]);
                let isWinner = (winner == candidates[index]);
                candidateGrid += this.generateCard(candidates[index], index, canVoteNow, voteNum, isWinner, size);
            }
            candidateGrid += '</div>';
        }

        this.candidatesDiv.innerHTML = candidateGrid;

        this.showElem(this.candidatesDiv);
    }

    getSecretXInput() {
        return document.getElementById('secret-x-input').value;
    }

    setupRound3() {
        this.showElem(this.round3Div);
    }

    setupFinishedState(winner) {
        this.hideElem(this.metaMaskDiv);
        this.hideElem(this.round3Div);
        document.getElementById('winner').innerHTML = ((winner == '') ? 'There is a tie' : winner);
        this.showElem(this.round4Div);
    }

    setCanVoteStatus(canVoteStatus, reason="") {
        document.getElementById('can-vote-status').innerHTML = (canVoteStatus) ? `You can vote` : `You cannot currently vote. ${reason}`;
    }
}