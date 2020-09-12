pragma solidity 0.4.24;

import "@aragon/os/contracts/lib/math/SafeMath.sol";

import "./interfaces/IMiniMeToken.sol";

// ❤️ Thanks Rohini for coming up with the name
contract Crust is IMiniMeToken {
    using SafeMath for uint256;
    IMiniMeToken[] public crumbs;
    string public name;
    string public symbol;
    uint8 public decimals;

    constructor(address[] memory _crumbs, string _name, string _symbol, uint8 _decimals) public {
        require(_crumbs.length > 0, "Crust.constructor: Crust must at least have one crumb");
        for(uint256 i = 0; i < _crumbs.length; i ++) {
            crumbs.push(IMiniMeToken(_crumbs[i]));
        }
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    /**
    * @notice Tells the balance of `_account`.
    * @param _account Address of the account.
    * @return The balance of the account.
    */
    function balanceOf(address _account) external view returns(uint256) {
        return this.balanceOfAt(_account, block.number);
    }

    /**
    * @notice Tells the balance of `_account` at block `_block`.
    * @param _account Address of the account.
    * @param _block Block number.
    * @return The balance of the account.
    */
    function balanceOfAt(address _account, uint256 _block) external view returns(uint256) {
        uint256 result = 0;
        for(uint256 i = 0; i < crumbs.length; i++) {
            result = result.add(crumbs[i].balanceOfAt(_account, _block));
        }
        return result;
    }

    /**
    * @notice Tells the total supply of this token.
    * @return The total supply.
    */
    function totalSupply() external view returns(uint256) {
        return this.totalSupplyAt(block.number);
    }

    /**
    * @notice Tells the total supply of this token at block `_block`.
    * @return The total supply.
    */
    function totalSupplyAt(uint256 _block) external view returns(uint256) {
        uint256 result = 0;
        for(uint256 i = 0; i < crumbs.length; i++) {
            result = result.add(crumbs[i].totalSupplyAt(_block));
        }
        return result;
    }
}