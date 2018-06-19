import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as logValidationActions from '../../redux/actions/logValidation';

import AddLogInputModal from './AddLogInputModal';

class AddLogInputModalContainer extends Component {

  render() {
    const { logValidationResults } = this.props.logValidation;
    const { logValidationClearResults,
            logValidate } = this.props.actions;
    const { addNewInput,
            displayAddLogInputModal,
            toggleModal } = this.props;
    return(
      <AddLogInputModal
        addNewInput={addNewInput}
        displayAddLogInputModal={displayAddLogInputModal}
        logValidationClearResults={logValidationClearResults}
        logValidationResults={logValidationResults}
        toggleModal={toggleModal}
        logValidate={logValidate}
      />
    );
  }
}

const mapStateToProps = state => ({
  logValidation: state.logValidation,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(logValidationActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddLogInputModalContainer);
