import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as confsActions from '../../redux/actions/confs';

import Sidebar from './Sidebar';

class SidebarContainer extends Component {

  componentWillMount() {
    const { confs } = this.props;
    if (!confs.byIndexName) {
      this.props.actions.fetchConfs();
    }
  }

  sidebarIndexSelect = indexName => event => {
    event.preventDefault();
    this.props.actions.sidebarIndexSelect(indexName);
  }

  render() {
    const { confs } = this.props;
    const { sidebarIndexSelect } = this.props.actions;
    return (
      <Sidebar
        confs={confs}
        sidebarIndexSelect={sidebarIndexSelect}
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

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContainer);
