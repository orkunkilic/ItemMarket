import { Tabs, Tab } from 'react-bootstrap';
import Market from '../abis/Market.json';
import React, { Component } from 'react';
import Token from '../abis/Token.json';
import Web3 from 'web3';
import './App.css';
import { create } from 'ipfs-http-client';

const client = create('https://ipfs.infura.io:5001/api/v0');

class App extends Component {
  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch);
  }

  async loadBlockchainData(dispatch) {
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      const netId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts();

      if (typeof accounts[0] !== 'undefined') {
        const balance = await web3.eth.getBalance(accounts[0]);
        this.setState({ account: accounts[0], balance, web3 });
      } else window.alert('Please login with Metamask!');

      try {
        const token = new web3.eth.Contract(
          Token.abi,
          Token.networks[netId].address
        );
        const market = new web3.eth.Contract(
          Market.abi,
          Market.networks[netId].address
        );
        const marketAddress = Market.networks[netId].address;
        this.setState({
          token,
          market,
          marketAddress,
        });
      } catch (e) {
        console.log('Error', e);
        window.alert('Contracts not deployed to the current network!');
      }
    } else window.alert('Please install Metamask!');
  }

  async uploadImage(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      this.setState({ fileUrl: url });
    } catch (e) {
      console.log('Upload error: ', e);
    }
  }

  async getItemInfo(itemId) {
    if (this.state.market !== 'undefined') {
      try {
        this.setState({ item: null });
        const itemInfo = await this.state.market.methods
          .getItemInfo(itemId)
          .call({ from: this.state.account });
        const response = await fetch(itemInfo['2']);
        itemInfo['2'] = await response.json();
        this.setState({ item: itemInfo });
        return itemInfo;
      } catch (e) {
        console.log('Error, getNFTInfo: ', e);
        this.setState({ item: null });
      }
    }
  }

  async buy(itemId) {
    if (this.state.market !== 'undefined') {
      try {
        const tokenInfo = await this.getItemInfo(itemId);
        await this.state.market.methods
          .buy(tokenInfo['0'], this.state.account, itemId)
          .send({ from: this.state.account, value: tokenInfo['1'] });
      } catch (e) {
        console.log('Error, buy: ', e);
      }
    }
  }

  async getTokenIds() {
    if (this.state.market !== 'undefined') {
      try {
        const tokenIds = await this.state.market.methods
          .getTokenIds()
          .call({ from: this.state.account });
        this.setState({ tokenIds });
      } catch (e) {
        console.log('Error, getTokenIds: ', e);
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      market: null,
      balance: 0,
      balanceInmarket: null,
      interest: null,
      DBC: null,
      marketAddress: null,
      receiver: null,
      NFTBalance: null,
      item: null,
      fileUrl: '',
      tokenIds: null,
    };
  }

  render() {
    return (
      <div className="text-monospace">
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <span
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b>Item Market</b>
          </span>
        </nav>
        <div className="container-fluid mt-5 text-center">
          <br></br>
          <h1>Welcome to Item Market</h1>
          <h2>{this.state.account}</h2>
          {/*  <div className="d-flex flex-column justify-content-center align-items-center">
            <button
              className="btn btn-primary mb-2"
              onClick={() => this.getTokenIds()}
            >
              GET BNFTs
            </button>
            {this.state.tokenIds
              ? 'You have ' + this.state.tokenIds.length + ' NFT(s)'
              : ''}
            <br />
            {this.state.tokenIds && this.state.tokenIds.length
              ? 'Your NFT id(s) are: ' + this.state.tokenIds
              : ''}
          </div> */}

          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto"></div>
            </main>
          </div>
        </div>
        <footer className="page-footer font-small mt-5">
          <div className="footer-copyright text-center py-3">
            <span className="text-muted">
              Add BNFT to your metamask wallet: {this.state.token?._address} ( 0
              decimal )
            </span>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
