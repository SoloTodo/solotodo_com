import React from 'react';
import {connect} from "react-redux";
import {
  DropdownItem, DropdownMenu, DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {withRouter} from "next/router";

class NavBarPreferredCountry extends React.Component {
  render() {
    const countryDomains = {
      1: 'https://www.solotodo.cl',
      4: 'https://www.solotodo.com.mx',
    };

    const countries = this.props.countries.filter(country => countryDomains[country.id]);

    return <UncontrolledDropdown nav>
      <DropdownToggle nav caret>
        <img src={this.props.preferredCountry.flag} alt={this.props.preferredCountry.name} width="30" height="20" />
      </DropdownToggle>
      <DropdownMenu>
        {countries.map(country => (
            <DropdownItem key={country.id}>
              {country.id === this.props.preferredCountry.id ? country.name : <a href={countryDomains[country.id] + this.props.router.asPath}>{country.name}</a>}
            </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  }
}

function mapStateToProps(state) {
  const { preferredCountry, countries } = solotodoStateToPropsUtils(state);

  return {
    preferredCountry,
    countries
  }
}

export default withRouter(connect(mapStateToProps)(NavBarPreferredCountry));