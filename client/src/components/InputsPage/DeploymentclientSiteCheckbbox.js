import React from 'react';
import { FormGroup,
         Input,
         Label } from 'reactstrap';

const deploymentclientSiteCheckbox = ({ isChecked, isEnabled, site, toggleCheckbox }) => {
  return (
    <FormGroup check inline>
      <Label for={site}>{' '}
        <Input
          type="checkbox"
          id={site}
          label={site}
          key={site}
          onChange={toggleCheckbox(site)}
          checked={isChecked}
          disabled={!isEnabled} />{' '}
          {site}
      </Label>
    </FormGroup>
  );
}

export default deploymentclientSiteCheckbox;
