import React from 'react';
import {connect} from "react-redux";
import FacebookLogin from "react-facebook-login";
import {toast} from 'react-toastify';
import {
  apiResourceStateToPropsUtils
} from "../../react-utils/ApiResource";
import {settings} from "../../settings";
import {login} from "../../redux/actions";
import queryString from "query-string";
import Router from "next/router";

class AccountFacebookLogin extends React.Component {
  responseFacebook = response => {
    if (response.accessToken) {
      this.props.fetchAuth('rest-auth/facebook/', {
        method: 'POST',
        body: JSON.stringify({access_token: response.accessToken})
      }).catch(err => {
        return err.json()
      }).then(res => {
        if (res.key) {
          toast.success('Inicio de sesión exitoso');
          this.props.login(res.key, this.props.state).then(() => {
            const parameters = queryString.parse(window.location.search);
            const redirectUrl = parameters.next || '/';
            Router.push(redirectUrl);
          });
        } else {
          // Something failed
          if (res.non_field_errors) {
            toast.error(res.non_field_errors[0], {autoClose: false});
          }
        }
      });
    }
  };

  render() {
    return <FacebookLogin
        appId={settings.facebookAppId}
        fields="name,email"
        callback={this.responseFacebook}
        textButton="Entrar con Facebook"
        redirectUri="https://www.solotodo.com/account/login"
    />
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth,
    state
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: (authToken, state) => {
      return dispatch(login(authToken, state));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountFacebookLogin)