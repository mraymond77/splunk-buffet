import React from 'react';
import { Button, Jumbotron } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function HomePage(props) {
  return (
    <div>
      <Jumbotron>
        <h1 className="display-3">Welcome</h1>
        <p className="lead">Choose a destination.</p>
        <Button color="link" tag={Link} to="/inputs">Configure Input Logs</Button> &nbsp;
        <Button color="link" tag={Link} to="/indexes">Configure Indexes</Button>
      </Jumbotron>
    </div>
  );
}

