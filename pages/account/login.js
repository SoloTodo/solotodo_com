import React from 'react';
import {connect} from "react-redux";
import {solotodoStateToPropsUtils} from "../../redux-utils";
import {toast} from 'react-toastify';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import {fetchJson} from '../../react-utils/utils'
import queryString from 'query-string';

import AccountFacebookLogin from "../../components/Account/AccountFacebookLogin";
import {setAuthToken} from "../../redux/actions";
import {settings} from "../../settings";
import TopBanner from "../../components/TopBanner";

class Login extends React.Component {
  static getInitialProps ({ reduxStore, res }) {
    const state = reduxStore.getState();

    const user = state.apiResourceObjects[settings.ownUserUrl] || null;

    if (user) {
      if (res) {
        // Redirect server side

        res.writeHead(302, {
          Location: "/"
        });
        res.end()
      } else {
        // Soft redirect client side

        const href = `/products?product=${productId}&slug=${expectedSlug}`;
        const as = `/products/${productId}-${expectedSlug}`;

        Router.push(href, as, { shallow: true })
      }
    }

    return {}
  }

  constructor(props) {
    super(props);

    this.state = {
      values: {
        email: '',
        password: ''
      },
      errors: {},
    }
  }

  handleEmailChange = evt => {
    this.setState({
      values: {
        ...this.state.values,
        email: evt.target.value
      }
    });
  };

  handlePasswordChange = evt => {
    this.setState({
      values: {
        ...this.state.values,
        password: evt.target.value
      }
    });
  };

  handleFormSubmit = evt => {
    evt.preventDefault();

    const formData = {
      email: this.state.values.email,
      password: this.state.values.password
    };

    return fetchJson('rest-auth/login/', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
      .then(response => {
        this.props.setAuthToken(response.key);

        const parameters = queryString.parse(window.location.search);
        const redirectUrl = parameters.next || '/';
        Router.push(redirectUrl);
      }).catch(err => {
        err.json().then(errJson => {
          const nonFieldErrors = errJson['non_field_errors'] || [];

          for (const error of nonFieldErrors) {
            toast.error(error, {autoClose: false});
          }

          this.setState({
            errors: errJson
          });
        });
      })
  };

  render() {
    const emailErrors = this.state.errors.email || [];
    const passwordErrors = this.state.errors.password || [];

    return <React.Fragment>
      <Head>
        <title>Ingreso de usuario</title>
      </Head>


        <div className="container">
          <div className="row">
            <TopBanner category="Any" />

            <div className="col-12">
              <h1>Iniciar sesión</h1>
              <hr />
            </div>
            <div className="col-12 col-sm-6 mb-3">
              <div className="content-card">
                <form onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Correo electrónico</label>
                    <input type="email"
                           className={emailErrors.length ? "form-control invalid" : "form-control"}
                           id="exampleInputEmail1"
                           placeholder="Correo electrónico"
                           onChange={this.handleEmailChange}
                           value={this.state.values.email}
                           required
                    />
                    {
                      emailErrors.map(err => (
                        <div className="invalid-input" key={err}>
                          {err}
                        </div>
                      ))
                    }
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input type="password"
                           className={passwordErrors.length ? "form-control invalid" : "form-control"}
                           id="password"
                           placeholder="Contraseña"
                           onChange={this.handlePasswordChange}
                           value={this.state.values.password}
                           required
                    />
                    {
                      passwordErrors.map(err => (
                        <div className="invalid-input" key={err}>
                          {err}
                        </div>
                      ))
                    }
                  </div>
                  <input type="submit" className="btn btn-primary" value="Ingresar"/>
                  <div className="pt-2">
                    <Link href="/account/password_reset"><a>¿Olvidaste tu contraseña?</a></Link>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="content-card">
                <h2>¿No tienes cuenta en SoloTodo?</h2>
                <p>Te puedes <Link href="/account/signup"><a className="register-link">registrar</a></Link></p>
                <p>También puedes acceder con tu cuenta de Facebook</p>
                <AccountFacebookLogin />
              </div>
            </div>
          </div>
        </div>
    </React.Fragment>
  }
}

function mapStateToProps(state) {
  const { user } = solotodoStateToPropsUtils(state);

  return {
    user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setAuthToken: authToken => {
      dispatch(setAuthToken(authToken));
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
