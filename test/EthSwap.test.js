const { assert } = require("chai");

// eslint-disable-next-line no-undef
const Token = artifacts.require("Token");
// eslint-disable-next-line no-undef
const EthSwap = artifacts.require("EthSwap");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("EthSwap", ([deployer, investor]) => {
  let token, ethSwap;

  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
    await token.transfer(ethSwap.address, tokens("100000"));
  });
  describe("Token deployment", async () => {
    it("Token contract has a name", async () => {
      const name = await token.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("EthSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "Eth Swap Instant Exchange");
    });
    it("contract has tokens", async () => {
      let balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance.toString(), tokens("100000"));
    });
  });

  describe("Buy Tokens", async () => {
    let result;
    before(async () => {
      result = await ethSwap.buyToken({
        from: investor,
        value: web3.utils.toWei("1", "ether"),
      });
    });
    it("Allows User to instantly purchase tokens from ethswap for a fixed price", async () => {
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("100"));

      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");
    });
  });
});
