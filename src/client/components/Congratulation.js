import React from 'react';
import axios from 'axios';
import LogoImg from '../imgs/logo.png';
import BigGulpImg from '../imgs/biggulp.png';
import BarCodeImg from '../imgs/barcode.png';
import AddToWalletBtn from '../imgs/add-to-wallet-button.png';
import { Button } from 'reactstrap';

class Congratulation extends React.Component {


  constructor(props) {

    super(props);

    this.state = {

    };

  }

  componentDidMount() {


  }
  use(event){
    window.location.href="landing";
  }

  render() {
    return (

      <div>
        <br/>
        <br/>
        <h1><font color="#ffa500">
      Congratulation!&nbsp; <br/><br/>You got 200 points!
        </font></h1>
          <br/><br/>
      <Button className="btn btn-success" type="button" onClick={this.use} >Use it! </Button>
        <br/>
        <br/>
      </div>
    );

  }
}


export default Congratulation;
