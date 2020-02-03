import React from 'react'
import {connect} from "react-redux";
import Router, {withRouter} from "next/router";
import {solotodoStateToPropsUtils} from "../redux/utils";
import {updatePreferredCountry} from "../redux/actions";
import {getAuthToken} from "../react-utils/utils";

class ChangeCountry extends React.Component {
  static async getInitialProps(ctx) {
    const {query, reduxStore} = ctx;
    const reduxState = reduxStore.getState();
    const { countries } = solotodoStateToPropsUtils(reduxState);

    const next = query.next;
    const country = countries.filter(country => country.iso_code.toLowerCase() === query.country)[0];

    return {
      country,
      next
    }
  }

  componentDidMount() {
    this.props.updatePreferredCountry(this.props.country, this.props.user);
    let next = this.props.next;
    if (!next) {
      next = "/"
    }

    Router.push(next)
  }

  render() {
    return <React.Fragment>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const { user } = solotodoStateToPropsUtils(state);

  return {
    user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updatePreferredCountry: (country, user) => {
      dispatch(updatePreferredCountry(country, user, getAuthToken()))
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChangeCountry))