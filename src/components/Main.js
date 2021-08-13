import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { AddressTranslator } from 'nervos-godwoken-integration';
import Address from './Address';
import Balance from './Balance';

import CompiledContractArtifact from '../abis/ERC20.json';

export default class Main extends Component {
  async componentDidMount() {
    const SUDT_PROXY_CONTRACT_ADDRESS =
      '0x5Aa3A57675D7F80f66Fa42B9d09626eB19c29D21';
    const ETHEREUM_ADDRESS = this.props.account;

    const addressTranslator = new AddressTranslator();
    const depositAddress = await addressTranslator.getLayer2DepositAddress(
      web3,
      ETHEREUM_ADDRESS
    );
    const layer2Address = depositAddress.addressString;
    const polyjuiceAddress =
      addressTranslator.ethAddressToGodwokenShortAddress(ETHEREUM_ADDRESS);
    const contract = new window.web3.eth.Contract(
      CompiledContractArtifact.abi,
      SUDT_PROXY_CONTRACT_ADDRESS
    );
    const nervosBalance = await window.web3.eth.getBalance(ETHEREUM_ADDRESS);

    this.setState({
      depositAddress: layer2Address,
      polyjuiceAddress,
      nervosBalance,
    });

    setInterval(async () => {
      const sudtBalance = await contract.methods
        .balanceOf(polyjuiceAddress)
        .call({
          from: ETHEREUM_ADDRESS,
        });

      this.setState({ sudtBalance });
    }, 1000);
  }

  constructor(props) {
    super(props);
    this.state = {
      polyjuiceAddress: '',
      depositAddress: '',
      sudtBalance: 0,
      nervosBalance: 0,
    };
  }

  render() {
    return (
      <div className='container-fluid mt-3'>
        <div className='col-lg-12 mb-3'>
          <h5>Address</h5>
          <Address
            addressName='Ethereum Address'
            address={this.props.account}
          />
          <Address
            addressName='Polyjuice Address'
            address={this.state.polyjuiceAddress}
          />
          <Address
            addressName='Layer 2 Deposit Address on Layer 1'
            address={this.state.depositAddress}
          />
        </div>
        <hr></hr>
        <div className='col-lg-12 mb-3 mt-3'>
          <h5>Balance</h5>
          <div className='d-flex justify-content-start'>
            <Balance
              asset='Nervos Layer 2 (CKB)'
              balance={this.state.nervosBalance / 10 ** 8}
            />
            <Balance
              asset='Nervos Layer 2 (ckETH)'
              balance={this.state.sudtBalance / 10 ** 18}
            />
            <Balance asset='SUDT' balance={this.state.sudtBalance} />
          </div>
        </div>
        <hr></hr>
        <div className='col-lg-12 mb-3 mt-3'>
          <h5>Transfer assets from Ethereum via Force Bridge</h5>
          <p className='mb-0'>
            Follow the steps given below to transfer assets from Ethereum to
            Nervos Layer 2.
          </p>
          <p className='mb-0'>
            1. Go to{' '}
            <a href='https://force-bridge-test.ckbapp.dev/bridge/Ethereum/Nervos?xchain-asset=0x0000000000000000000000000000000000000000'>
              Force Bridge website.
            </a>
          </p>
          <p className='mb-0'>
            2. Select Eth as an asset to transfer, then specify the amount in
            the top box. There will be a small fee for the transfer, and this
            will be calculated automatically.
          </p>
          <p className='mb-0'>
            3. Copy your Layer 2 Deposit Address on Layer 1 from above. In the
            box marked "Recipient", paste this address.
          </p>
          <p className='mb-0'>
            4. When you have finished inputting and reviewing your selections,
            click the Bridge button. You will be asked to sign the transaction
            using MetaMask.
          </p>
        </div>
        <hr></hr>
        <main
          role='main'
          className='mt-3 col-lg-12 d-flex justify-content-between'
        >
          <form
            className=''
            onSubmit={(event) => {
              event.preventDefault();
              const content = this.postContent.value;
              this.props.createPost(content);
            }}
          >
            <div className='form-group'>
              <input
                id='postContent'
                type='text'
                ref={(input) => {
                  this.postContent = input;
                }}
                className='form-control mr-0 w-full'
                placeholder="What's on your mind?"
                required
              />
            </div>
            <button type='submit' className='btn btn-primary btn-block mb-4'>
              Share
            </button>
          </form>
          {this.props.posts.map((post, key) => {
            return (
              <div className='card mb-4' key={key}>
                <div className='card-header'>
                  <img
                    className='mr-2'
                    width='30'
                    height='30'
                    alt='profile'
                    src={`data:image/png;base64,${new Identicon(
                      post.author,
                      30
                    ).toString()}`}
                  />
                  <small className='text-muted'>
                    {post.author.toLowerCase()}
                  </small>
                </div>
                <ul id='postList' className='list-group list-group-flush'>
                  <li className='list-group-item'>
                    <p className='lead'>{post.content}</p>
                  </li>
                  <li key={key} className='list-group-item py-2'>
                    <p className='float-left mt-2 mb-0 text-muted'>
                      TIPS:{' '}
                      {window.web3.utils.fromWei(
                        post.tipAmount.toString(),
                        'Ether'
                      )}{' '}
                      ETH
                    </p>
                    <button
                      className='float-right btn btn-secondary'
                      onClick={(event) => {
                        let tipAmount = window.web3.utils.toWei('0.1', 'Ether');
                        this.props.tipPost(event.target.name, tipAmount);
                      }}
                    >
                      TIP 0.1 ETH
                    </button>
                  </li>
                </ul>
              </div>
            );
          })}
        </main>
      </div>
    );
  }
}
