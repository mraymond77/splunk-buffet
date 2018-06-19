import React from 'react';
import { ListGroup } from 'reactstrap';

import SidebarIndexButton from './SidebarIndexButton';

const Sidebar = ({ confs, sidebarIndexSelect }) => {
  const { sidebarIndexSelection } = confs;
  const indexButtons = Object.keys(confs.byIndexName).map(indexName =>
    (<SidebarIndexButton
       key={indexName}
       indexName={indexName}
       sidebarIndexSelect={sidebarIndexSelect}
       isActive={sidebarIndexSelection === indexName}
     />)
  );
  return (
      <div className="sidebar-wrapper">
        <div className="sidebar-brand">
          { (Object.keys(confs.byIndexName).length > 0) && <h5>Your Indexes</h5> }
        </div>
        <ListGroup>
          {indexButtons}
        </ListGroup>
      </div>
  );
}

export default Sidebar;
