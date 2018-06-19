import React from 'react';
import { ListGroupItem } from 'reactstrap';

export default function SidebarIndexButton({ indexName, sidebarIndexSelect, isActive }) {

  const selectIndex = (indexName) => (event) => {
    event.preventDefault();
    sidebarIndexSelect(indexName);
  };

  return (
    <ListGroupItem
      tag="button"
      className="btn-sidebar"
      onClick={selectIndex(indexName)}
      active={isActive}>{indexName}
    </ListGroupItem>
  );
}
