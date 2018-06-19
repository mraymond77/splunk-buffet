import React, { Component } from 'react';
import { Button,
         Form,
         Jumbotron,
         Modal,
         ModalBody,
         ModalFooter } from 'reactstrap';

import AddLogInputModalContainer from './AddLogInputModalContainer';
import DeploymentclientSiteCheckbox from './DeploymentclientSiteCheckbbox';
import LogInputForm from './LogInputForm';

import customizations from '../../customizations.json';

const initSites = {};
customizations.deploymentclientSites.map(site => initSites[site] = false);

export default class InputsPage extends Component {

  static getDerivedStateFromProps(nextProps, prevState) {
      const nextState = {};
      // Update DeploymentClient sites checkboxes to reflect selected index.
      nextState.sites = Object.assign({}, initSites);
      nextProps.deploymentClientSites.map(site => nextState.sites[site] = true);
      if (prevState.sidebarIndexSelection === nextProps.sidebarIndexSelection) {
        // sidebarIndexSelection hasn't changed, so the rerender was called by adding a new input
        nextState.inputsConfs = JSON.parse(JSON.stringify(prevState.inputsConfs));
      } else {
        // Deep copy props.inputsConfs to reflect selected index.
        nextState.inputsConfs = JSON.parse(JSON.stringify(nextProps.inputsConfs));
      }
      nextState.sidebarIndexSelection = nextProps.sidebarIndexSelection;
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
      inputsConfs: props.inputsConfs,
      newInput: {},
      editMode: false,
      displaySaveModal: false,
      displayCancelModal: false,
      displayAddLogInputModal: false,
      sidebarIndexSelection: props.sidebarIndexSelection,
    };
  }

  addNewInput = newInput => {
    const newInputs = JSON.parse(JSON.stringify(this.state.inputsConfs));
    newInputs.push(newInput);
    this.setState({ inputsConfs: newInputs });
  }

  handleSave = component => event => {
    event.preventDefault();
    // for better or for worse, this takes a component as an argument
    // (can be `modal` or `button`) to handle either one. Just wanted it all in one function.
    const { inputsConfs,
            deploymentClientSites,
            saveConfs,
            sidebarIndexSelection } = this.props;
    // Create sites array from deploymentClientSites for comparing to state
    const origSites = Object.assign({}, initSites);
    deploymentClientSites.map(site => origSites[site] = true);
    if (component === 'button') {
      // if there are changes, show the displaySaveModal
      if (JSON.stringify(inputsConfs) !== JSON.stringify(this.state.inputsConfs)
          || JSON.stringify(origSites) !== JSON.stringify(this.state.sites)) {
          this.setState({ displaySaveModal: true });
      } else {
        // no changes.. so just exit editMode
        this.setState({ editMode: false });
      }
    } else if (component === 'modal') {
      // build update confs object to POST to api
      const updatedConfs = { [sidebarIndexSelection]: {} };
      // add/remove log inputs, if there are changes
      if (JSON.stringify(inputsConfs) !== JSON.stringify(this.state.inputsConfs)) {
        updatedConfs[sidebarIndexSelection]['inputs_conf'] = JSON.parse(JSON.stringify(this.state.inputsConfs));
      }
      // add/remove deploymentclient sites, if there are changes
      if (JSON.stringify(origSites) !== JSON.stringify(this.state.sites)) {
        const updatedSites = [];
        Object.keys(this.state.sites).forEach(site => {
          if (this.state.sites[site]) {
            updatedSites.push(site);
          }
        });
        updatedConfs[sidebarIndexSelection]['deploymentclient_conf'] = updatedSites;
      }
      // POST changes to API
      saveConfs(updatedConfs);
      this.setState({ editMode: false });
    }
  }

  handleCancel = component => event => {
    event.preventDefault();
    const { inputsConfs,
            deploymentClientSites } = this.props;
    // Create sites array from deploymentClientSites for comparing to state
    const origSites = Object.assign({}, initSites);
    deploymentClientSites.map(site => origSites[site] = true);
    if (component === 'button') {
      // if there are changes, show the displayCancelModal
      if (JSON.stringify(inputsConfs) !== JSON.stringify(this.state.inputsConfs)
          || JSON.stringify(origSites) !== JSON.stringify(this.state.sites)) {
        this.setState({ displayCancelModal: true });
      } else {
        // no changes.. so just exit editMode
        this.setState({ editMode: false });
      }
    } else if (component === 'modal') {
      // discard changes by making deep copy from props. exit editMode.
      this.setState(
        {
          sites: origSites,
          inputsConfs: JSON.parse(JSON.stringify(inputsConfs)),
          editMode: false,
        });
    }
  }

  handleLogInputChange = (arrayIndex, property) => (e) => {
    const newInputs = Object.assign([], this.state.inputsConfs);
    newInputs[arrayIndex][property] = e.target.value;
    this.setState({ inputsConfs: newInputs });
  }

  removeInput = arrayIndex => event => {
    event.preventDefault();
    const newInputs = JSON.parse(JSON.stringify(this.state.inputsConfs));
    newInputs.splice(arrayIndex, 1);
    this.setState({ inputsConfs: newInputs });
  }

  toggleCheckbox = site => event => {
    const updatedSites = Object.assign({}, this.state.sites);
    updatedSites[site] = !this.state.sites[site];
    this.setState({ sites: updatedSites });
  }

  toggleEditMode = () => {
    this.setState({
      editMode: !this.state.editMode,
    });
  }

  toggleModal = modalName => event => {
    this.setState({ [modalName]: !this.state[modalName] });
  }

  render() {
    const { sidebarIndexSelection } = this.props;
    const dcSiteCheckboxes = Object.keys(this.state.sites).map(site =>
      (<DeploymentclientSiteCheckbox
         key={site}
         isChecked={this.state.sites[site]}
         isEnabled={this.state.editMode}
         site={site}
         toggleCheckbox={this.toggleCheckbox}
       />)
    );
    const LogInputForms = Object.keys(this.state.inputsConfs).map(arrayIndex =>
      (<LogInputForm
         key={arrayIndex.toString()}
         arrayIndex={arrayIndex}
         editMode={this.state.editMode}
         handleLogInputChange={this.handleLogInputChange}
         inputConf={this.state.inputsConfs[arrayIndex]}
         isEnabled={this.state.editMode}
         removeInput={this.removeInput}
       />)
    );
    if (!sidebarIndexSelection) {
      return (
        <div className="col-10 col-sm-8 col-md-8 col-lg-5">
          <Jumbotron>
            <h3>Inputs</h3>
            <p>Choose an index in the sidebar to view and edit it's inputs.</p>
          </Jumbotron>
        </div>
      );
    } else {
      return (
        <div className="col-10 col-sm-8 col-md-8 col-lg-5">
          <Modal isOpen={this.state.displaySaveModal} onClick={this.toggleModal('displaySaveModal')}>
            <ModalBody>
              Changes have been made to the configuration. Confirm save?
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleSave('modal')}>yes</Button>{' '}
              <Button color="secondary" onClick={this.toggleModal('displaySaveModal')}>Cancel</Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={this.state.displayCancelModal} onClick={this.toggleModal('displayCancelModal')}>
            <ModalBody>
              There are unsaved changes. Discard?
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleCancel('modal')}>yes</Button>{' '}
              <Button color="secondary" onClick={this.toggleModal('displayCancelModal')}>Cancel</Button>
            </ModalFooter>
          </Modal>
          <AddLogInputModalContainer
            addNewInput={this.addNewInput}
            displayAddLogInputModal={this.state.displayAddLogInputModal}
            toggleModal={this.toggleModal}
          />
          <Form>
            <h5><span className="inputs-indexname-span"> {sidebarIndexSelection} </span> Configuration</h5>
            <Button
              color="info"
              size="sm"
              onClick={this.toggleEditMode}
              disabled={this.state.editMode}>Edit</Button>{' '}
            <Button
              color="warning"
              size="sm"
              onClick={this.handleSave('button')}
              disabled={!this.state.editMode}>Save</Button>{' '}
            <Button
              color="danger"
              size="sm"
              onClick={this.handleCancel('button')}
              disabled={!this.state.editMode}>Cancel</Button>{' '}
            <hr/>
            <h6>Input logs</h6>
            <hr/>
            {LogInputForms}
            <div style={{paddingTop: "5px"}}>
              <Button
                outline
                color="info"
                size="sm"
                onClick={this.toggleModal('displayAddLogInputModal')}
                disabled={!this.state.editMode}>Add a input log
              </Button>{' '}
            </div>
            <hr/>
            <h6>DeploymentClient Sites</h6>
            <hr/>
            {dcSiteCheckboxes}
          </Form>
        </div>
      );
    }
  }
}
