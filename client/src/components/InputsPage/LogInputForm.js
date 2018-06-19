import React, { Component } from 'react';
import { Card,
         Input,
         InputGroup,
         InputGroupAddon,
         Tooltip } from 'reactstrap';

//export default function LogInputForm(props) {
export default class LogInputForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false,
    }
  }

  tooltipToggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  render () {
    const { arrayIndex,
            handleLogInputChange,
            inputConf,
            isEnabled,
            removeInput } = this.props;

    return (
      <div style={{padding: "1px"}}>
        <Card body outline color="info">
          {isEnabled && <div>
                          <a
                            className="close-thin"
                            id={"removeInputIcon" + arrayIndex}
                            onClick={removeInput(arrayIndex)}
                          >×</a>
                          <Tooltip
                            placement="top"
                            isOpen={this.state.tooltipOpen}
                            target={"removeInputIcon" + arrayIndex}
                            toggle={this.tooltipToggle}
                          >Remove this input</Tooltip>
                        </div>
          }
          <InputGroup>
          <InputGroupAddon addonType="prepend">Log Path</InputGroupAddon>
            <Input
              id={inputConf.path}
              name="path"
              className="form-control-inputs"
              onChange={handleLogInputChange(arrayIndex, 'path')}
              placeholder="/var/log/mylog.log"
              type="path"
              value={inputConf.path}
              disabled={!isEnabled}
            />
          </InputGroup>
          <InputGroup>
          <InputGroupAddon addonType="prepend">Sourcetype</InputGroupAddon>
            <Input
              id={inputConf.sourcetype}
              name="sourcetype"
              className="form-control-inputs"
              onChange={handleLogInputChange(arrayIndex, 'sourcetype')}
              placeholder="sourcetype"
              type="sourcetype"
              value={inputConf.sourcetype}
              disabled={!isEnabled}
            />
          </InputGroup>
        </Card>
      </div>
    );}
  }
