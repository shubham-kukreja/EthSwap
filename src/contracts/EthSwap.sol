pragma solidity ^0.5.0;
import "./Token.sol";

contract EthSwap {
    string public name = "Eth Swap Instant Exchange";
    Token public token;
    uint256 public rate = 100;
    event TokenPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyToken() public payable {
        uint256 tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this) >= token.amount));
        token.transfer(msg.sender, tokenAmount);
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }
}
