import React, { Component } from 'react';
import { Button,
         FormGroup,
         FormText,
         Input,
         InputGroup,
         InputGroupAddon,
         Modal,
         ModalBody,
         ModalFooter } from 'reactstrap';

import LogValidationResultsBody from './LogValidationResults';


export default class AddLogInputModal extends Component {

  static getDerivedStateFromProps(nextProps, prevState) {
    // Check validation results to set state.logValidationSuccess
   const nextState = Object.assign({}, prevState);
    if (nextProps.logValidationResults) {
      if (nextProps.logValidationResults[0].match_percent >= .9) {
        nextState.logValidationSuccess = true;
      }
    }
    if (nextState !== prevState) {
      return (
        nextState
      );
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      addLogFormValues: {
        path: '',
        sourcetype: '',
      },
      logValidationSuccess: false,
      tooltipOpen: false,
    };

    this.logSampleInput = React.createRef();
  }

  handleUploadLogSample = (event) => {
    event.preventDefault();
    const { logValidate } = this.props;
    const logdata = new FormData();
    logdata.append('file', this.logSampleInput.files[0]);
    logValidate(logdata);
  }

  handleAddLogButtonClick = (event) => {
    const { addNewInput } = this.props;
    const newLogInput = {
      path: this.state.addLogFormValues.path,
      sourcetype:  this.state.addLogFormValues.sourcetype,
      type: 'monitor' };
    addNewInput(newLogInput);
    this.resetToInitialState(event);
  }

  resetToInitialState = (event) => {
    const { logValidationClearResults,
            toggleModal } = this.props;
    const initLogFormValues = {
      path: '',
      sourcetype: '' };
    logValidationClearResults();
    this.setState({ logValidationSuccess: false });
    this.setState({ addLogFormValues: initLogFormValues });
    // toggleModal is curry'ed; it returns a function that takes an event.
    const displayAddLogInputModalFunc = toggleModal('displayAddLogInputModal');
    displayAddLogInputModalFunc(event);
  }

  handleAddLogInputChange = (property) => (e) => {
    const newValues = Object.assign({}, this.state.addLogFormValues);
    newValues[property] = e.target.value;
    this.setState({ addLogFormValues: newValues });
  }

  render () {
    const { logValidationResults,
            displayAddLogInputModal } = this.props;
    return (
      <Modal className="add-log-modal-dialog" isOpen={displayAddLogInputModal}>
        <ModalBody>
          {(logValidationResults ? <LogValidationResultsBody
                                     logValidationResults={logValidationResults}
                                   /> :
          <div>
            <h5>Log Validation</h5>
            <p>It is required your that your log be validated before it is cleared to be sent into Splunk.
               Please see (link to wiki) for more information on what kind of log data is acceptable for Acme Splunk. Thanks.</p>
            <FormGroup>
              <Input type="file" id="logSample" name="logSample" innerRef={input => (this.logSampleInput = input)} />
              <FormText color="muted">Please upload a sample of your log file for validation.</FormText>
            </FormGroup>
            <Button color="primary" size="sm" onClick={this.handleUploadLogSample}>Validate log</Button>{' '}
            <hr/>
          </div>
          )}
          <InputGroup>
          <InputGroupAddon addonType="prepend">Log Path</InputGroupAddon>
            <Input
              id="addLogFormPath"
              name="path"
              className="form-control-inputs"
              onChange={this.handleAddLogInputChange('path')}
              placeholder="/var/log/mylog.log"
              type="path"
              value={this.state.addLogFormValues.path}
              disabled={!this.state.logValidationSuccess}
            />
          </InputGroup>
          <InputGroup>
          <InputGroupAddon addonType="prepend">Sourcetype</InputGroupAddon>
            <Input
              id="addLogFormSourcetype"
              name="sourcetype"
              className="form-control-inputs"
              onChange={this.handleAddLogInputChange('sourcetype')}
              placeholder="sourcetype"
              type="sourcetype"
              value={this.state.addLogFormValues.sourcetype}
              disabled={!this.state.logValidationSuccess}
            />
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={this.handleAddLogButtonClick}
            disabled={!this.state.logValidationSuccess}>Add to log inputs</Button>{' '}
          <Button
            color="secondary"
            onClick={this.resetToInitialState}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
