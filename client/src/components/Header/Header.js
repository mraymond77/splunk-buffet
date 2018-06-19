import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar,
         NavbarBrand,
         Nav,
         NavItem,
         NavLink } from 'reactstrap';

import logo from '../../assets/images/logo.svg';
import customizations from '../../customizations.json';


class Header extends Component {

    handleLogOutClick = event => {
      event.preventDefault();
      this.props.logUserOut();
      this.props.confsReset();
    }

    render = () => {
      const { isLoggedIn, username } = this.props;
      const navbarTitle = customizations.navbarBrand;
      return (
        <header>
          <Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/">
              <img src={logo} className="logo-buffet" alt="logo" />
              {navbarTitle} Splunk <span className="title-buffet">Buffet</span>
            </NavbarBrand>
              <Nav className="mr-auto" navbar>
                  { isLoggedIn ?
                    <Nav className="mr-auto" navbar>
                      <NavItem>
                        <NavLink className="no-hover">Welcome, {username} &nbsp;&nbsp; | </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink tag={Link} to="/">Home</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink tag={Link} to="/inputs">Inputs</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink tag={Link} to="/logout" onClick={this.handleLogOutClick}>Log Out</NavLink >
                      </NavItem>
                    </Nav>
                    :
                    <Nav className="mr-auto" navbar>
                      <NavItem>
                        <NavLink tag={Link} to="/login">Log In</NavLink>
                      </NavItem>
                    </Nav> }
                <NavItem>
                  <NavLink href="https://wiki.corp.acme.com/pages">Wiki</NavLink>
                </NavItem>
              </Nav>
          </Navbar>
        </header>
      );
    }
  }

export default Header;
