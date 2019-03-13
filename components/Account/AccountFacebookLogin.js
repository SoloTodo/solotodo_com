import React from 'react';
import {connect} from "react-redux";
import FacebookLogin from "react-facebook-login";
import {toast} from 'react-toastify';
import {
  apiResourceStateToPropsUtils
} from "../../react-utils/ApiResource";
import {settings} from "../../settings";

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
          this.props.login(res.key);
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
    fetchAuth
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: authToken => {
      // dispatch(setAuthToken(authToken))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountFacebookLogin)