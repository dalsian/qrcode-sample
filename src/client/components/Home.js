import React from 'react'
import LogoImg from '../imgs/logo.png';
import BigGulpImg from '../imgs/biggulp.png';
import BarCodeImg from '../imgs/barcode.png';
import AddToWalletBtn from '../imgs/add-to-wallet-button.png';
import AddtoWallet from './AddtoWallet';
import RegisterForm from './RegisterForm';
import OtherInfo from './OtherInfo';
import { Button } from 'reactstrap';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { Link } from 'react-router-dom';




  class Home extends React.Component {

    test(){
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios
      if(isAndroid){
          window.location.href="https://play.google.com/store/apps/details?id=com.sei.android&hl=en_US";
      }
    }

    componentDidMount() {
      this.test();
    }

    survey(){
      window.location.href="/survey";
    }




    render() {
      return (

        <div >
          <AddtoWallet />
          <RegisterForm />
          <OtherInfo />
        </div>


        // <div>
        //   <br/>
        //   <br/>
        //   <br/>
        //   <br/>
        //   <Nav className="ml-auto" navbar>
        //     <h2 ><font color="#ffa500">Wanna earn 200 points?</font></h2><br/>
        //     <h4><font color="#ffa500">Please take survey</font></h4><br/>
        //     <div>
        //       <a href="https://play.google.com/store/apps/details?id=com.sei.android&hl=en_US" >Not now</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        //       <Button type='button' className='btn btn-success' onClick={this.survey} >Take survey</Button>
        //     </div>
        //
        //   </Nav>
        //   <br/>
        //   <br/>
        //   <br/>
        //   <br/>
        // </div>
      );
    }
}

export default Home;
