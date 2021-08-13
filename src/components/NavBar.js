import React, { Component } from 'react';
import Identicon from 'identicon.js';

export default class NavBar extends Component {
  render() {
    return (
      <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
        <h2 className='text-white'>Social Network Dapp</h2>
        {/* <div className='collapse navbar-collapse' id='navbarText'>
          <ul className='navbar-nav mr-auto'></ul>
          <div className='d-flex flex-column'>
            <div>
              <span className='mr-2 text-white'>ETH address:</span>
              <span className='navbar-text'>{this.props.account}</span>
            </div>
            <div>
              <span className='mr-2 text-white'>Polyjuice address:</span>
              <span className='navbar-text'>{polyjuiceAddress}</span>
            </div>
          </div>
        </div> */}
      </nav>
    );
  }
}
