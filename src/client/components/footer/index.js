import React from 'react'
import './Footer.css';

const Footer = () => {

  return (
    <footer className="footer">
      <hr />
      <div className="container">
        {/* <span className="text-muted">Place sticky footer content here.</span> */}
        <div className="row">
          <div className="col-sm-2">
            <h2 className="text-success">Get to know us</h2>
            <ul>
              <li>
                <a href="http://corp.7-eleven.com/corp/about">About 7-Eleven</a>
              </li>
              <li>
                <a href="http://careers.7-eleven.com/careers/Careers.html">Careers</a>
              </li>
              <li>
                <a href="http://corp.7-eleven.com/corp/newsroom">Newsroom</a>
              </li>
            </ul>
          </div>
          {/*<div className="col-sm-2">*/}
            {/*<h2 className="text-success">Franchise Info</h2>*/}
            {/*<ul>*/}
              {/*<li>*/}
                {/*<a href="http://franchise.7-eleven.com/franchise/franchising-101">Franchising 101</a>*/}
              {/*</li>*/}
              {/*<li>*/}
                {/*<a href="http://franchise.7-eleven.com/franchise/new-franchisee">Franchise Process</a>*/}
              {/*</li>*/}
              {/*<li>*/}
                {/*<a href="http://franchise.7-eleven.com/franchise/veterans-franchise-program">Franchising for Veterans</a>*/}
              {/*</li>*/}
            {/*</ul>*/}
          {/*</div>*/}
          {/*<div className="col-sm-2">*/}
            {/*<h2 className="text-success">Download</h2>*/}
            {/*<ul>*/}
              {/*<li>*/}
                {/*<a href="https://www.7-eleven.com/app">7-Eleven App</a>*/}
              {/*</li>*/}
              {/*<li>*/}
                {/*<a href="https://www.7-eleven.com/7now-app">7Now Delivery App</a>*/}
              {/*</li>*/}
            {/*</ul>*/}
          {/*</div>*/}
        </div>
      </div>
    </footer>
  )
}

export default Footer;
