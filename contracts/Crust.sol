pragma solidity 0.4.24;

import "@aragon/os/contracts/lib/math/SafeMath.sol";

import "./interfaces/IMiniMeToken.sol";

// ❤️ Thanks Rohini for coming up with the name
contract Crust is IMiniMeToken {
    using SafeMath for uint256;
    IMiniMeToken[] public crumbs;

    constructor(address[] memory _crumbs) public {
        require(_crumbs.length > 0, "Crust.constructor: Crust must at least have one crumb");
        for(uint256 i = 0; i < _crumbs.length; i ++) {
            crumbs.push(IMiniMeToken(_crumbs[i]));
        }
    }

    function balanceOf(address _account) external view returns(uint256) {
        uint256 result = 0;
        for(uint256 i = 0; i < crumbs.length; i++) {
            result = result.add(crumbs[i].balanceOf(_account));
        }
        return result;
    }
    function balanceOfAt(address _account, uint256 _block) external view returns(uint256) {
        uint256 result = 0;
        for(uint256 i = 0; i < crumbs.length; i++) {
            result = result.add(crumbs[i].balanceOfAt(_account, _block));
        }
        return result;
    }
    function totalSupply() external view returns(uint256) {
        uint256 result = 0;
        for(uint256 i = 0; i < crumbs.length; i++) {
            result = result.add(crumbs[i].totalSupply());
        }
        return result;
    }
    function totalSupplyAt(uint256 _block) external view returns(uint256) {
        uint256 result = 0;
        for(uint256 i = 0; i < crumbs.length; i++) {
            result = result.add(crumbs[i].totalSupplyAt(_block));
        }
        return result;
    }
}