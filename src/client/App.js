import React, { Component } from 'react';

// CSS
import './assets/bootstrap.min.css';
import './assets/main.css';

// Images
import LogoImg from './imgs/logo.png';
import BigGulpImg from './imgs/biggulp.png';
import BarCodeImg from './imgs/barcode.png';
import AddToWalletBtn from './imgs/add-to-wallet-button.png';

export default class App extends Component {
  render() {
    return (
      <div>
        <nav class="navbar navbar-fixed-top">
          <div class="container">
              <a href="#"><img class="logo" src={LogoImg}/></a>
              <div class="icons-cont">
                <a><span class="glyphicon glyphicon-search" aria-hidden="true"></span></a>
                <a><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></a>
                <a><span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span></a>
              </div>
          </div>
        </nav>

        <div class="container welcome-area">
          <div class="welcome">
            <h2>Welcome</h2>
            <small>Member ID: 234123412341</small>
          </div>
        </div>

        <div class="points">
          <p>Thanks for signing up </p>
          <p>You have earned 800 reward points</p>
        </div>

        <div class="barcode-area">
          <div class="product">
            <img src={BigGulpImg}/>
          </div>
          <p>Scar this barcode to redeem your free drink</p>
          <div class="barcode">
            <img src={BarCodeImg}/>
          </div>
        </div>

        <div class="wallet-button">
          <a href="https://qrcode-demo-test.herokuapp.com/v1/pass?id=c653357d-d30a-42b7-856e-abd625fc1af2" id="wallet-href"><img src={AddToWalletBtn}/></a>
        </div>
        <div class="footer">
          <div class="container">
            <p>Please <a>click here</a> and we'd be happy to help.</p>
          </div>
        </div>
      </div>
    );
  }
}
