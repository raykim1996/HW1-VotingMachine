// Class that modifies the frontend ui
class UI {
    constructor() {
        this.spinnerOverlay = document.getElementById('spinner-overlay');
        this.stopSpinner(200);

        this.metaMaskDiv = document.getElementById('metamask-div');
        this.showElem(this.metaMaskDiv);

        this.electionCreatorConnectionDiv = document.getElementById('election-creator-connection-div');
        this.hideElem(this.electionCreatorConnectionDiv);

        this.parametersSetupDiv = document.getElementById('parameters-setup-div');
        this.hideElem(this.parametersSetupDiv);

        this.parametersValueDiv = document.getElementById('parameters-values-div');
        this.hideElem(this.parametersValueDiv);

        this.electionParamsDiv = document.getElementById('election-params-div');
        this.hideElem(this.electionParamsDiv);

        this.electionCompletedDiv = document.getElementById('election-completed-div');
        this.hideElem(this.electionCompletedDiv);
    }


    // show spinner overlay to indicate loading
    startSpinner() {
        this.spinnerOverlay.classList.add('is-active');
    }

    // stop spinner overlay to indicate loading is finished
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

    setupConnectToElectionCreator(account) {
        this.hideElem(this.metaMaskDiv);
        this.showElem(this.electionCreatorConnectionDiv);
        document.getElementById('connected-account-header').innerHTML = `Connected to MetaMask Account: <b>${account}</b>`;
    }

    displayCandidates(candidates) {

    }

    getElectionCreatorAddress() {
        return document.getElementById('election-creator-address').value;
    }

    setupElectionParams() {
        this.hideElem(this.electionCreatorConnectionDiv);
        this.showElem(this.electionParamsDiv);
    }

    getCandidates() {
        return document.getElementById('candidates').value;
    }

    getVoters() {
        return document.getElementById('voters').value;
    }

    getElectionName() {
        return document.getElementById('election-name').value;
    }

    showCompleted(electionName, candidates, voters, p, g, address) {

        document.getElementById('election-name-completed').innerHTML = electionName;
        document.getElementById('election-address-completed').innerHTML = address;

        document.getElementById('election-candidates-completed').innerHTML = candidates.reduce((acc, x) => {return `${acc}${x}, `}, "");
        document.getElementById('election-voters-completed').innerHTML = voters.reduce((acc, x) => {return `${acc}${x}, `}, "");

        document.getElementById('election-p-completed').innerHTML = p;
        document.getElementById('election-g-completed').innerHTML = g;

        this.hideElem(this.electionParamsDiv);
        this.showElem(this.electionCompletedDiv);
    }
}