import React, { Component } from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, Label } from 'reactstrap';

import customizations from '../../customizations.json';


export default class LoginPage extends Component {
    constructor(props) {
      super(props);

      this.state = {
        username: '',
        password: '',
      };
    }

    // catch enter key
    handleKeyPress = target => {
      if (target.charCode === 13) {
        this.handleValidSubmit();
      }
    }

    handleUsernameChange = event => {
      this.setState({ username: event.target.value });
    }

    handlePasswordChange = event => {
      this.setState({ password: event.target.value });
    }

    handleValidSubmit = () => {
      const { logUserIn } = this.props;
      const formData = this.state;
      logUserIn(formData);
    }

    render() {
        return (
            <div className="row">
              <div className="col-10 col-sm-7 col-md-5 col-lg-4">
              <p>{customizations.loginMessage}</p>
                <AvForm onValidSubmit={this.handleValidSubmit}>
                  <AvGroup>
                    <Label for="ldapUsername">Username</Label>
                    <AvInput
                      id="ldapUserame"
                      name="username"
                      onChange={this.handleUsernameChange}
                      onKeyPress={this.handleKeyPress}
                      placeholder="username"
                      required
                      type="username"
                      value={this.state.username}
                    />
                    <AvFeedback>A valid username is required to log in.</AvFeedback>
                  </AvGroup>
                  <AvGroup>
                    <Label for="ldapPassword">Password</Label>
                    <AvInput
                      id="ldapPassword"
                      name="password"
                      onChange={this.handlePasswordChange}
                      onKeyPress={this.handleKeyPress}
                      placeholder="password"
                      required
                      type="password"
                      value={this.state.password}
                    />
                  </AvGroup>
                  <Button>Log In</Button>
                </AvForm>
              </div>
            </div>
        );
    }
}
