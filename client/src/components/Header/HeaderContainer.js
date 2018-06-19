import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { logUserOut } from '../../redux/actions/authentication';
import { confsReset } from '../../redux/actions/confs';

import Header from './Header';

class HeaderContainer extends Component {

  render() {
    const { isLoggedIn, username } = this.props.authentication;
    const { logUserOut, confsReset } = this.props.actions;
    return(
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        logUserOut={logUserOut}
        confsReset={confsReset}
      />
    );
  }
}

const mapStateToProps = state => ({
  authentication: state.authentication,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    logUserOut: bindActionCreators(logUserOut, dispatch),
    confsReset: bindActionCreators(confsReset, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
