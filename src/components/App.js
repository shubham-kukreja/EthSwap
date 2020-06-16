import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import Navbar from "./Navbar";
import EthSwap from "../abis/EthSwap.json";
import Token from "../abis/Token.json";
import Main from "./Main";

class App extends Component {
  state = {
    account: "",
    ethBalance: "0",
    token: {},
    tokenBalance: "0",
    ethSwap: {},
    loading: true,
  };

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else {
      window.alert("Please Install MetaMask.");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });

    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });
      let tokenBalance = await token.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      window.alert("Token Contract Not Deployed.");
    }

    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });
    } else {
      window.alert("Token Contract Not Deployed.");
    }

    this.setState({ loading: false });
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true });
    console.log(this.state.ethSwap.methods);
    this.state.ethSwap.methods.buyToken
      .send({
        value: etherAmount,
        from: this.state.account,
      })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true });
    this.state.token.methods
      .approve(this.state.ethSwap.address, tokenAmount)
      .send({
        from: this.state.account,
      })
      .on("transactionHash", (hash) => {
        this.state.ethSwap.methods
          .sellToken(tokenAmount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto text-center"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">
                {this.state.loading ? (
                  <div
                    className="spinner-border text-primary mt-3"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <Main
                    ethBalance={this.state.ethBalance}
                    tokenBalance={this.state.tokenBalance}
                    buyTokens={this.buyTokens}
                    sellTokens={this.sellTokens}
                  />
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
