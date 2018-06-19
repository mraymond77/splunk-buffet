import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as confsActions from '../../redux/actions/confs';

import InputsPage from './InputsPage';

class InputsPageContainer extends Component {

  render() {
    const { sidebarIndexSelection } = this.props.confs;
    const { saveConfs } = this.props.actions;
    let inputsConfs = [];
    let deploymentClientSites = [];
    try {
      inputsConfs = JSON.parse(JSON.stringify(this.props.confs.byIndexName[sidebarIndexSelection]['inputs_conf']));
      deploymentClientSites = JSON.parse(JSON.stringify(this.props.confs.byIndexName[sidebarIndexSelection]['deploymentclient_conf']));
    } catch(e) {
      if (!(e instanceof TypeError)) {
        throw e;
      }
    }
    return(
      <InputsPage
        sidebarIndexSelection={sidebarIndexSelection}
        deploymentClientSites={deploymentClientSites}
        inputsConfs={inputsConfs}
        saveConfs={saveConfs}
      />
    );
  }
}

const mapStateToProps = state => ({
  confs: state.confs,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(confsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(InputsPageContainer);
