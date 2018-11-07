import React, { Component } from 'react'
import { Link } from 'react-router-dom';
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

import './Header.css';
import logo from '../../assets/images/logo.png';

class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
        <div className="header-border"></div>
        <Navbar color="light" light expand="md">
          <div className="container">
            <NavbarBrand tag={Link} to="/">
              <img src={logo} alt="7-Eleven" />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav navbar>

                {/*<NavItem>*/}
                  {/*<NavLink tag={Link} to="#">Financial Services</NavLink>*/}
                {/*</NavItem>*/}

              </Nav>
              <Nav className="ml-auto" navbar>
                {/*<UncontrolledDropdown nav inNavbar>*/}
                  {/*<DropdownToggle nav caret>*/}
                    {/*Stores*/}
                {/*</DropdownToggle>*/}
                  {/*<DropdownMenu right>*/}
                    {/*<DropdownItem>*/}
                      {/*<NavLink tag={Link} to="/stores">Stores List</NavLink>*/}
                    {/*</DropdownItem>*/}
                  {/*</DropdownMenu>*/}
                {/*</UncontrolledDropdown>*/}
              </Nav>
            </Collapse>
          </div>
        </Navbar>
      </div>
    );
  }
}

export default Header;
