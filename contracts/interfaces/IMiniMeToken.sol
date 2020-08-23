pragma solidity 0.4.24;

interface IMiniMeToken {
    function balanceOf(address _account) external view returns(uint256);
    function balanceOfAt(address _account, uint256 _block) external view returns(uint256);
    function totalSupply() external view returns(uint256);
    function totalSupplyAt(uint256 _block) external view returns(uint256);
}