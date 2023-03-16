// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma experimental ABIEncoderV2;

interface Coin {
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract Governance {
    uint256 public poolSize;
    uint256 public currentId = 1;
    uint256 public proposalTime = 14 days;
    uint256 public votingCooldown = 1 days;

    bool public votingStarted = true;
    bool public proposalStarted = true;
    bool public isSecondRound = false;

    address[] public admins;
    uint256 public minimumDeposit;
    uint256 public maximumDeposit;
    Coin public TORA;

    constructor(
        uint256 _minimumDeposit,
        uint256 _maximumDeposit,
        string memory _currentAgenda,
        address _TORA
    ) {
        admins.push(msg.sender);
        minimumDeposit = _minimumDeposit;
        maximumDeposit = _maximumDeposit;
        currentAgenda = _currentAgenda;
        TORA = Coin(_TORA);
    }

    struct Deposit {
        uint256 amount;
        uint256 time;
        bool isProposed;
        uint256 lastVoted;
    }

    struct Proposal {
        string proposal;
        uint256 time;
        address proposer;
        uint256 votes;
        uint256 id;
        bool isPassed;
        address[] voters;
    }

    Proposal[] internal allProposals;
    Proposal[] internal passedProposals;

    string public currentAgenda;

    mapping(address => Deposit) internal deposits;

    modifier _onlyOwner() {
        require(isAdmin(), "Not admin");
        _;
    }

    function changeProposeTime(uint256 _time) public _onlyOwner {
        proposalTime = _time;
    }

    function changeVotingCooldown(uint256 _time) public _onlyOwner {
        votingCooldown = _time;
    }

    function changeMinimumDeposit(uint256 _minimumDeposit) public _onlyOwner {
        minimumDeposit = _minimumDeposit;
    }

    function changeMaximumDeposit(uint256 _maximumDeposit) public _onlyOwner {
        maximumDeposit = _maximumDeposit;
    }

    function changeCurrentAgenda(string memory agendaItem) public _onlyOwner {
        currentAgenda = agendaItem;
    }

    function addAdmin(address _admin) public _onlyOwner {
        admins.push(_admin);
    }

    function isAdmin() public view returns (bool) {
        for (uint256 i = 0; i < admins.length; i++) {
            if (admins[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function deposit(uint256 amount) public {
        require(amount >= minimumDeposit, "Deposit too small");
        require(amount >= maximumDeposit, "Deposit too big");

        Deposit storage user = deposits[msg.sender];

        user.amount += amount;
        user.time = block.timestamp;
        user.isProposed = false;
        poolSize += amount;

        TORA.transferFrom(msg.sender, address(this), amount);
    }

    function propose(string memory message) public {
        Deposit storage user = deposits[msg.sender];
        require(
            allProposals.length < 350,
            "The platform currently has too many proposals"
        );
        require(user.isProposed == false, "Already proposed, deposit again");
        require(user.amount > 0, "Already withdrawn");
        require(
            user.time + proposalTime < block.timestamp,
            "Proposal time not over"
        );
        user.isProposed = true;

        allProposals.push(
            Proposal(
                message,
                block.timestamp,
                msg.sender,
                0,
                currentId,
                false,
                new address[](0)
            )
        );
        currentId++;
    }

    function vote(uint256 id) public {
        Deposit storage user = deposits[msg.sender];
        require(user.amount > 0, "Already withdrawn");
        require(
            user.lastVoted + votingCooldown < block.timestamp,
            "Voting cooldown not over"
        );

        uint256 i = id - allProposals[0].id;
        allProposals[i].votes++;
        allProposals[i].voters.push(msg.sender);

        user.lastVoted = block.timestamp;
    }

    function startSecondRound() public _onlyOwner {
        isSecondRound = true;
    }

    function returnToFirstRound() public _onlyOwner {
        isSecondRound = false;
    }

    function winProposal(string memory _agendaItem) public _onlyOwner {
        uint256 maxVotes = 0;
        uint256 maxVotesId = 0;
        for (uint256 i = 0; i < allProposals.length; i++) {
            if (allProposals[i].votes > maxVotes) {
                maxVotes = allProposals[i].votes;
                maxVotesId = i;
            }
        }

        allProposals[maxVotesId].isPassed = true;
        passedProposals.push(allProposals[maxVotesId]);

        delete allProposals;

        currentAgenda = _agendaItem;
        isSecondRound = false;
    }

    function withdraw() public {
        Deposit storage user = deposits[msg.sender];
        require(
            user.time + 2 weeks < block.timestamp,
            "You can only withdraw after 2 weeks from your deposit time"
        );
        poolSize -= user.amount;
        TORA.transfer(msg.sender, user.amount);
        user.amount = 0;
    }

    function getTimeLeftToVote() public view returns (uint256) {
        if (deposits[msg.sender].lastVoted + votingCooldown < block.timestamp) {
            return 0;
        } else {
            return
                deposits[msg.sender].lastVoted +
                votingCooldown -
                block.timestamp;
        }
    }

    function getTimeLeftToPropose() public view returns (uint256) {
        if (deposits[msg.sender].time + proposalTime < block.timestamp) {
            return 0;
        } else {
            return deposits[msg.sender].time + proposalTime - block.timestamp;
        }
    }

    function getMinimumDeposit() public view returns (uint256) {
        return minimumDeposit;
    }

    function getMaximumDeposit() public view returns (uint256) {
        return maximumDeposit;
    }

    function getProposalTime() public view returns (uint256) {
        return proposalTime;
    }

    function getCurrentAgenda() public view returns (string memory) {
        return currentAgenda;
    }

    function getVotingCooldown() public view returns (uint256) {
        return votingCooldown;
    }

    function getIfProposed() public view returns (bool) {
        return deposits[msg.sender].isProposed;
    }

    function getIfWithdrawn() public view returns (bool) {
        return deposits[msg.sender].amount > 0;
    }

    function getDeposit() public view returns (Deposit memory) {
        return deposits[msg.sender];
    }

    function getIsSecondRound() public view returns (bool) {
        return isSecondRound;
    }

    function getWinners() public view returns (Proposal[] memory) {
        return passedProposals;
    }

    function returnWithdrawableAmount() public view returns (uint256) {
        return deposits[msg.sender].amount;
    }

    function emergencyReset() public _onlyOwner {
        for (uint256 i = 0; i < allProposals.length; i++) {
            allProposals[i].votes = 0;
            allProposals[i].isPassed = false;
        }
        isSecondRound = false;
    }

    function returnAllProposals() public view returns (Proposal[] memory) {
        return allProposals;
    }

    function returnWinners() public view returns (Proposal[] memory) {
        return passedProposals;
    }
}
