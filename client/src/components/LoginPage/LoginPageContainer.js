import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from '../../redux/actions/authentication';

import LoginPage from './LoginPage';

class LoginPageContainer extends Component {

  render() {
    const { logUserIn } = this.props.actions;
    return (
      <div>
        <LoginPage logUserIn={logUserIn} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(authActions, dispatch)
});

export default connect(null, mapDispatchToProps)(LoginPageContainer);
