import React from 'react';
import {connect} from "react-redux";
import {
  DropdownItem, DropdownMenu, DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {updatePreferredCountry} from "../../redux/actions";
import {getAuthToken} from "../../react-utils/utils";

class NavBarPreferredCountry extends React.Component {
  handleCountryClick = (evt, country) => {
    evt.preventDefault();

    this.props.updatePreferredCountry(country, this.props.user)
  };

  render() {
    return <UncontrolledDropdown nav>
      <DropdownToggle nav caret>
        <img src={this.props.preferredCountry.flag} alt={this.props.preferredCountry.name} width="30" height="20" />
      </DropdownToggle>
      <DropdownMenu>
        {this.props.countries.map(country => (
            <DropdownItem key={country.id} onClick={evt => this.handleCountryClick(evt, country)}>
              {country.name}
            </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  }
}

function mapStateToProps(state) {
  const { ApiResourceObject } = apiResourceStateToPropsUtils(state);
  const { user, preferredCountry, countries } = solotodoStateToPropsUtils(state);

  return {
    ApiResourceObject,
    user,
    preferredCountry,
    countries
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updatePreferredCountry: (country, user) => {
      dispatch(updatePreferredCountry(country, user, getAuthToken()))
    }
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBarPreferredCountry);