import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { userIsAuthenticated,
         userIsNotAuthenticated } from '../utils/auth';

import ErrorBox from './ErrorBox/ErrorBoxContainer';
import Footer from './Footer';
import Header from './Header/HeaderContainer';
import HomePage from './HomePage/HomePage';
import LoginPage from './LoginPage/LoginPageContainer';
import Sidebar from './Sidebar/SidebarContainer';
import InputsPage from './InputsPage/InputsPageContainer';

// Need to to apply the hocs here to avoid applying them inside the render method
const InputsUserAuthenticated = userIsAuthenticated(InputsPage);
const HomeUserAuthenticated = userIsAuthenticated(HomePage);
const LoginUserNotAuthenticated = userIsNotAuthenticated(LoginPage);

const Template = ({ authentication, progress }) =>{
    return (
      <Router>
        <div className="wrapper">
          <Header username="anonymous" authentication={authentication} />
          <Sidebar/>
          <section className="page-content-wrapper">
            <Route exact path="/inputs" component={InputsUserAuthenticated} />
            <Route exact path="/" component={HomeUserAuthenticated}/>
            <Route exact path="/login" component={LoginUserNotAuthenticated}/>
            <div className="loader-wrapper"
                 style={progress > 0 ? { display: 'block' } : { display: 'none' }}>
              <div className="loader-box">
                <div className="loader">Loading...</div>
              </div>
            </div>
            <ErrorBox />
            <Footer/>
          </section>
        </div>
      </Router>
    );
};

export default Template;
