import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as authActions from '../redux/actions/authentication';

import Template from './Template';

class TemplateContainer extends Component {

  componentWillMount = () => {
    // Before the component mounts, check for an existing user session
    this.props.actions.checkSession();
  }

  render() {
    const { authentication, progress } = this.props;
    return (
      <Template progress={progress} authentication={authentication} />
    );
  }
}

function mapStateToProps(state) {
  return {
    progress: state.progress,
    authentication: state.authentication,
  };
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(authActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateContainer);
