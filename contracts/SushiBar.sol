// SPDX-License-Identifier: MIT
// Need to change compiler version to support current openzepplin contracts
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// SushiBar is the coolest bar in town. You come in with some Sushi, and leave with more! The longer you stay, the more Sushi you get.
// This contract handles swapping to and from xSushi, SushiSwap's staking token.
contract SushiBar is ERC20("SushiBar", "xSUSHI"){
    using SafeMath for uint256;
    IERC20 public sushi;
    
    // Variable to keep track of number of deposits
    uint256 public index;

    //Structure of a deposit
    struct Deposit{
        address who;
        uint256 when;
        uint256 amount;
    }

    // Array to keep track of deposits
    Deposit[] private deposits;

    // Define the Sushi token contract
    constructor(IERC20 _sushi) {
        sushi = _sushi;
    }

    // Enter the bar. Pay some SUSHIs. Earn some shares.
    // Locks Sushi and mints xSushi
    function enter(uint256 _amount) public returns (uint256){
        // Gets the amount of Sushi locked in the contract
        uint256 totalSushi = sushi.balanceOf(address(this));
        // Gets the amount of xSushi in existence
        uint256 totalShares = totalSupply();
        // If no xSushi exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalSushi == 0) {
            _mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xSushi the Sushi is worth. The ratio will change overtime, as xSushi is burned/minted and Sushi deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalShares).div(totalSushi);
            _mint(msg.sender, what);
        }

        // Creating and Appending the deposit in the array
        Deposit memory _deposit;
        _deposit.who = msg.sender;
        _deposit.when = block.timestamp;
        _deposit.amount = _amount;

        deposits.push(_deposit);

        // Updating the index
        index += 1;

        // Lock the Sushi in the contract
        sushi.transferFrom(msg.sender, address(this), _amount);

        return index;
    }

    // Retrive deposit details by index
    function getDepositDetails(uint256 _index) public view 
    returns ( address who,
             uint256 when,
             uint256 amount
            ) {
        Deposit storage _deposit = deposits[_index];
        return (_deposit.who, _deposit.when, _deposit.amount);
    }


    // Leave the bar. Claim back your SUSHIs.
    // Unlocks the staked + gained Sushi and burns xSushi
    // Will work only after 8 days
    function leave(uint256 _share, uint256 _index) public {
        // Gets the amount of xSushi in existence
        Deposit storage deposit = deposits[_index];
        require(msg.sender == deposit.who, "Sender is not the depositor");
        require(_share <= deposit.amount, "Amount deposited is less than share requested");
        require(block.timestamp - deposit.when >= 8 days, "Lock period is still active, please use forceLeave");
        
        uint256 totalShares = totalSupply();
        // Calculates the amount of Sushi the xSushi is worth
        uint256 what = _share.mul(sushi.balanceOf(address(this))).div(totalShares);
        deposit.amount = deposit.amount.sub(what);
        _burn(msg.sender, _share);
        sushi.transfer(msg.sender, what);
    }

    // Leave the bar. Claim back your SUSHIs.
    // Unlocks the staked + gained Sushi and burns xSushi
    // Will work before 8 days but will deduct the appropriate tax
    function forceLeave(uint256 _share, uint256 _index) public {
        // Gets the amount of xSushi in existence
        Deposit storage deposit = deposits[_index];
        require(msg.sender == deposit.who, "Sender is not the depositor");
        require(_share <= deposit.amount, "Amount deposited is less than share requested");
        uint256 depositDuration = block.timestamp - deposit.when;
        require(depositDuration >= 2 days, "Locked period is still active, please try after some time");
        require(depositDuration <= 8 days, "Locked period is inactive, please use leave");
        
        uint256 totalShares = totalSupply();
        // Calculates the amount of Sushi the xSushi is worth
        uint256 what = _share.mul(sushi.balanceOf(address(this))).div(totalShares);

        // Calculating tax
        uint256 tax = _calculateTax(what, deposit.when);
        what = what - tax;
        deposit.amount = deposit.amount.sub(what);
        _burn(msg.sender, _share);
        sushi.transfer(msg.sender, what);
    }

    // Function to calculatr tax according to requirements
    function _calculateTax(uint256 _amount, uint256 _depositTime) private view returns (uint256) {
        uint256 depositDuration = block.timestamp - _depositTime;
        uint256 tax;
        if (depositDuration <= 4 days){
            tax = _amount * 75 / 100;
            return tax;
        }
        if (depositDuration <= 6 days){
            tax = _amount * 50 / 100;
            return tax;
        }
        tax = _amount * 25 / 100;
        return tax;
    }

}