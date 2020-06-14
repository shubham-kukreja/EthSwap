import React, { Component } from "react";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

export default class Main extends Component {
  state = {
    type: 1,
  };
  render() {
    return (
      <div id="content" className="mt-3">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-light"
            onClick={() => {
              this.setState({ type: 1 });
            }}
          >
            Buy
          </button>
          <button
            className="btn btn-light"
            onClick={() => {
              this.setState({ type: 0 });
            }}
          >
            Sell
          </button>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            {this.state.type ? (
              <BuyForm
                ethBalance={this.props.ethBalance}
                tokenBalance={this.props.tokenBalance}
                buyTokens={this.props.buyTokens}
              />
            ) : (
              <SellForm
                ethBalance={this.props.ethBalance}
                tokenBalance={this.props.tokenBalance}
                sellTokens={this.props.sellTokens}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
