pragma solidity ^0.4.23;

/*contract DappToken {
  address public owner;
  uint public last_completed_migration;

  constructor() public {
    owner = msg.sender;
  }

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}*/

contract DappToken {

	/**
	 * #1 Constructor : In solidity function with same name as contract is called Constructor and we declare this function as public
	 ** for visibility , because we want this function to run when ever the contract is deployed on ethereum or any other blockchain
	 ** platform.
	 *
	 * #2 Set the  total number of DappToken
	 *
	 * #3 Read the total number of token.
	 *
	 * Declare a variable in solidity we first declare its data type. before using a variable in a function like totalSupply
	 ** we need to declare it first at top.
	 */

	uint256  public totalSupply;

	function DappToken() public {
		// This is a state or class variable that can we accessible in contract in any function.
		totalSupply = 1000000;
	}
}