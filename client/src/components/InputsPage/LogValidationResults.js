import React from 'react';
import { Alert } from 'reactstrap';

const logValidationResultsBody = ({ logValidationResults }) => {
  // default alert is for failure
  let alertColor = 'danger';
  let alertMessage = 'The log does not meet standards. In fact, you suck.';
  let sourcetypes = undefined;
  let warnings = undefined;

  if (logValidationResults[0].match_percent >= .9) {
    alertColor = 'success';
    alertMessage = 'success';
  }
  if (logValidationResults[0].warnings.length > 0 ) {
    warnings = Object.keys(logValidationResults[0].warnings).map(arrayIndex =>
      (<li key={arrayIndex}>
         {logValidationResults[0].warnings[arrayIndex]}
      </li>)
    );
  }
  return(
    <div>
      <Alert color={alertColor}>
        {alertMessage}
      </Alert>
      {warnings &&
      <Alert
        color="warning" >
        <b>Warning(s):</b>
        <ul>
          {warnings}
        </ul>
      </Alert>
      }
      <div>{JSON.stringify(logValidationResults)}</div>
    </div>
  );
}

export default logValidationResultsBody;
