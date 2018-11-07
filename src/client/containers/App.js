import React from 'react'
import { BrowserRouter, Route, Switch,Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Home from './HomeContainer';
import Header from './HeaderContainer';
import Footer from './FooterContainer';
import Survey from '../components/Survey';
import Congratulation from '../components/Congratulation';
import Landing from '../components/Landing';

const Navigation = createBrowserHistory();

export default class App extends React.Component {

  isIOS(){
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios
    return isiOS;
  }

  isFullScreenPage() {
    const path = Navigation.location.pathname;
    if (['/landing'].indexOf(path) > -1)
      return true;
    else
      return false;
  }

  render() {
    const fullScreen = this.isFullScreenPage();
    const isIOS =this.isIOS();
    return (
  <BrowserRouter>
    <div>
      {!fullScreen && <Header/>}
      <div className="container">
        <Switch>

          <Route path="/survey" component={Survey}/>
          <Route path="/congratulation" component={Congratulation}/>
          <Route path="/landing" component={Landing}/>
          <Route  path="/"  component={Home} />
        </Switch>
      </div>
      {!fullScreen && <Footer/>}

    </div>


  </BrowserRouter>
    );}

}


