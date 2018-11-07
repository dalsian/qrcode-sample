import React from 'react';
import LogoImg from '../imgs/logo.png';
import BigGulpImg from '../imgs/biggulp.png';
import BarCodeImg from '../imgs/barcode.png';
import AddToWalletBtn from '../imgs/add-to-wallet-button.png';

  class AddtoWallet extends React.Component{


    addToWallet(){
      window.location.href="https://qrcode-reward.herokuapp.com/v1/pass?id=c653357d-d30a-42b7-856e-abd625fc1af2";
    }
    render() {
      const cssText1={
        font: "38px/30px 'TrasandinaUltra',Helvetica,Arial,sans-serif",
        color: "#432357",
        margin: "0 0 12px",
        padding: 0
    }
      return (

        <div className="se-account-inner">
          <br/>
          <h1  style={cssText1}>UNLOCK CONVENIENCE</h1>


          <p>Welcome to 7-Eleven ,Starting earn points on every purchase with 7REWARDS pass and redeem the free items.
            </p>

          <div className="se-module se-module-register-hdr">
            <div className="wallet-button">
              <a href="https://qrcode-reward.herokuapp.com/v1/pass?id=c653357d-d30a-42b7-856e-abd625fc1af2"  id="wallet-href"><img src={AddToWalletBtn}/></a>
            </div>
          </div>

          <br/>
          <hr/>
          <br/>


          <p>Create your 7-Eleven account to earn 800 points and redeem a free drink.
          </p>

          <div>
            <button className="btn btn-primary btn-block">Connect with
              Facebook
            </button>
            <div>OR</div>
          </div>

        </div>

      );
    }
}


export default AddtoWallet;
