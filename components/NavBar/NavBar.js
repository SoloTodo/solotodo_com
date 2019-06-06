import React from "react";
import {connect} from "react-redux";
import Link from "next/link";
import {withRouter} from 'next/router'
import onClickOutside from "react-onclickoutside";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import {
  apiResourceStateToPropsUtils
} from "../../react-utils/ApiResource";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import NavBarPreferredCountry from "./NavBarPreferredCountry";
import NavBarPreferredStores from "./NavBarPreferredStores"
import NavBarDepartments from "./NavBarDepartments";
import NavBarSelectedDepartment from "./NavBarSelectedDepartment";
import NavBarBudgets from "./NavBarBudgets"
import SearchByKeywords from "./SearchByKeywords"
import {initializeUser, invalidateLocalUser} from "../../redux/actions";

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      selectedDepartment: undefined
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.router.asPath !== this.props.router.asPath) {
      if (this.state.selectedDepartment) {
        this.undefSelectedDepartment();
      }

      if (this.state.isOpen) {
        this.setState({
          isOpen: false
        });
      }
    }

    if (this.state.selectedDepartment) {
      if (!prevProps.isSmallOrSmaller && this.props.isSmallOrSmaller) {
        this.undefSelectedDepartment();
      }
    }
  }

  undefSelectedDepartment = () => {
    this.setState({
      selectedDepartment: undefined
    });
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  handleSelectedDepartmentChange = selectedDepartment => {
    if (this.state.selectedDepartment && selectedDepartment && this.state.selectedDepartment.name === selectedDepartment.name) {
      this.setState({
        selectedDepartment: undefined
      })
    } else {
      this.setState({
        selectedDepartment
      })
    }
  };

  handleLogout = evt => {
    evt.preventDefault();

    this.props.fetchAuth('rest-auth/logout/', {
      method: 'POST'
    }).then(res => {
      this.props.invalidateLocalUser(this.props.state);
    })
  };

  handleClickOutside = evt => {
    this.undefSelectedDepartment();
  };

  render() {
    const user = this.props.user;

    return <div>
      <Navbar color="dark" dark expand="md" fixed="top" id="navbar">
        <Link href="/index" as="/">
          <a>
            <img className="img-fluid navbar-brand" src="/static/logo.svg" alt="Logo"/>
          </a>
        </Link>
        <NavbarToggler onClick={this.toggle}/>
        <Collapse isOpen={this.state.isOpen} navbar>
          <NavBarDepartments
              selectedDepartment={this.state.selectedDepartment}
              onSelectedDepartmentChange={this.handleSelectedDepartmentChange} />

          <Nav onClick={this.undefSelectedDepartment} navbar>
            <SearchByKeywords/>
            <NavBarBudgets/>
            <NavBarPreferredStores/>

            <UncontrolledDropdown nav>
              <DropdownToggle nav caret className="navbar-icon-item navbar-user-link">
                <i className="fas fa-user">&nbsp;</i>
              </DropdownToggle>
              {user ?
                  <DropdownMenu>
                    <DropdownItem>
                      {user.email}
                    </DropdownItem>
                    <DropdownItem divider/>
                    <Link href="/account/password_change">
                      <a className="dropdown-item navbar-dropdown-link">Cambiar contraseña</a>
                    </Link>
                    <a href="." className="dropdown-item navbar-dropdown-link" onClick={this.handleLogout}>Cerrar sesión</a>
                  </DropdownMenu>
                  :
                  <DropdownMenu>
                    <Link href={`/account/login?next=${encodeURIComponent(this.props.router.asPath)}`}>
                      <a className="dropdown-item navbar-dropdown-link">
                        Iniciar sesión
                      </a>
                    </Link>
                    <Link href="/account/signup">
                      <a className="dropdown-item navbar-dropdown-link">Registrarse</a>
                    </Link>
                  </DropdownMenu>
              }
            </UncontrolledDropdown>

            <NavBarPreferredCountry />
          </Nav>
        </Collapse>
      </Navbar>

      <NavBarSelectedDepartment selectedDepartment={this.state.selectedDepartment} />
    </div>
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);
  const {user} = solotodoStateToPropsUtils(state);

  return {
    fetchAuth,
    user,
    isSmallOrSmaller: state.browser.lessThan.medium,
    mediaType: state.browser.mediaType,
    state
  }
}

function mapDispatchToProps(dispatch) {
  return {
    invalidateLocalUser: state => {
      dispatch(initializeUser(null, state))
    }
  }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(onClickOutside(NavBar)));