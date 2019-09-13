import React from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem,
  NavLink,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import NavBarPreferredStores from "./NavBarPreferredStores";
import NavBarHideRefurbished from "./NavBarHideRefurbished";

class NavBarFilters extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <UncontrolledDropdown nav>
      <DropdownToggle nav caret className="navbar-icon-item navbar-user-link">
        <i className="fas fa-filter">&nbsp;</i>
      </DropdownToggle>
      <DropdownMenu persist>
        <NavBarPreferredStores/>
        <NavBarHideRefurbished/>
      </DropdownMenu>

    </UncontrolledDropdown>
  }
}

export default NavBarFilters