import React from 'react';
import {connect} from "react-redux";
import {
  DropdownItem, DropdownMenu, DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";
import {solotodoStateToPropsUtils} from "../../redux-utils";
import {apiResourceStateToPropsUtils} from "../../react-utils/ApiResource";
import {updatePreferredCountry} from "../../redux/actions";

class NavBarPreferredCountry extends React.Component {
  handleCountryClick = (evt, country) => {
    evt.preventDefault();

    this.props.updatePreferredCountry(country)
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
  const { ApiResourceObject, authToken } = apiResourceStateToPropsUtils(state);
  const { user, preferredCountry, countries } = solotodoStateToPropsUtils(state);

  return {
    ApiResourceObject,
    authToken,
    user,
    preferredCountry,
    countries
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    updatePreferredCountry: country => {
      dispatch(updatePreferredCountry(country, ownProps.user, ownProps.authToken))
    }
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBarPreferredCountry);