import React from 'react';
import {connect} from "react-redux";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownToggle, Nav, NavItem, NavLink,
  UncontrolledDropdown
} from "reactstrap";
import classNames from 'classnames';
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {parseBrowsePathToNextJs} from "../../utils";

class NavBarDepartments extends React.Component {
  handleDepartmentClick = (evt, department) => {
    this.props.onSelectedDepartmentChange(department);
  };

  departmentItems = department => {
    const links = [];
    const nextRegex = /\/(?<category>[^?]+)\??(?<args>[^\/]*)/;

    for (const section of department.sections) {
      if (section.path === '/') {
        for (const item of section.items) {
          links.push(<Link key={item.name} {...parseBrowsePathToNextJs(item.path)}>
            <a className="dropdown-item">{item.name}</a>
          </Link>)
        }
      } else {
        const nextParams = nextRegex.exec(section.path).groups;

        links.push(<Link key={section.name} href={`/browse?category=${nextParams.category}&${nextParams.args}`} as={section.path}>
          <a className="dropdown-item">{section.name}</a>
        </Link>)
      }
    }

    return links;
  };

  render() {
    return <Nav id="navbar-departments" className="mr-auto" navbar>
      {this.props.navigation.map(department => (
          this.props.isSmallOrSmaller ?
              <UncontrolledDropdown nav key={department.name}>
                <DropdownToggle nav caret>
                  {department.name}
                </DropdownToggle>
                <DropdownMenu>
                  {this.departmentItems(department)}
                </DropdownMenu>
              </UncontrolledDropdown> :
              <NavItem key={department.name} className={classNames('navbar-nav', {'active': this.props.selectedDepartment && department.name === this.props.selectedDepartment.name})}>
                <NavLink className="nav-link" href="#"
                         onClick={evt => this.handleDepartmentClick(evt, department)}>
                  {department.name}
                </NavLink>
              </NavItem>
      ))}
    </Nav>
  }
}

function mapStateToProps(state) {
  const {preferredCountry} = solotodoStateToPropsUtils(state);

  return {
    preferredCountry,
    isSmallOrSmaller: state.browser.lessThan.medium,
    navigation: state.navigation
  }
}

export default connect(mapStateToProps)(NavBarDepartments);
