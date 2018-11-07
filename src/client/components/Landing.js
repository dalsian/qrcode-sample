import React from 'react';
import axios from 'axios';
import LogoImg from '../imgs/logo.png';
import BigGulpImg from '../imgs/biggulp.png';
import BarCodeImg from '../imgs/barcode.png';
import AddToWalletBtn from '../imgs/add-to-wallet-button.png';

// require('../assets/bootstrap.min.css');
// require('../assets/main.css');
// import style2 from '../assets/bootstrap.min.css';
import style from '../assets/main.css';

// import Home from "./Home";
class Landing extends React.Component {


  constructor(props) {

    super(props);

    this.state = {
    };

  }

  componentDidMount() {
    // var Fingerprint = require('express-fingerprint')
    // var fingerprint = new Fingerprint({screen_resolution: true}).get();
    // console.log("fingerprint:",fingerprint);
    console.log("url:",'http://localhost:3030/v1/test/'+navigator.userAgent+'/register');
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-fixed-top">
          <div className="container">
            <a href="#"><img className="logo" src={LogoImg}/></a>
            <div className="icons-cont">
              <a><span className="glyphicon glyphicon-search" aria-hidden="true"/></a>
              <a><span className="glyphicon glyphicon-map-marker" aria-hidden="true"/></a>
              <a><span className="glyphicon glyphicon-menu-hamburger" aria-hidden="true"/></a>
            </div>
          </div>
        </nav>

        <div className="container welcome-area">
          <div className="welcome">
            <h2>Welcome</h2>
            <small>Member ID: 234123412341222</small>
          </div>
        </div>

        <div className="points">
          <p>Thanks for signing up </p>
          <p>You have earned 800 reward points</p>
        </div>

        <div className="barcode-area">
          <div className="product">
            <img src={BigGulpImg}/>
          </div>
          <p>Scan this barcode to redeem your free drink</p>
          <div className="barcode">
            <img src={BarCodeImg}  />
          </div>
        </div>

        <div className="wallet-button">
          <a href="https://qrcode-demo-test.herokuapp.com/v1/pass?id=c653357d-d30a-42b7-856e-abd625fc1af2" id="wallet-href"><img src={AddToWalletBtn}/></a>
        </div>
        <div className="footer">
          <div className="container">
            <p>
              Please
              <a href="/haha">click here</a>
              and we'd be happy to help.


            </p>



          </div>
        </div>
      </div>




    );
  }
}


export default Landing;
