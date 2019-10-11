import React from 'react';
import {connect} from "react-redux";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import {toast} from 'react-toastify';
import {fetchJson} from '../../react-utils/utils'
import AccountFacebookLogin from "../../components/Account/AccountFacebookLogin";
import TopBanner from "../../components/TopBanner";
import {settings} from "../../settings";


class Signup extends React.Component {
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
        Router.push("/")
      }
    }

    return {}
  }

  constructor(props) {
    super(props);
    this.state = {
      values: {
        email: '',
        password1: '',
        password2: ''
      },
      errors: {}
    };
  }

  handleEmailChange = evt => {
    this.setState({
      values: {...this.state.values, email: evt.target.value}
    });
  };

  handlePassword1Change = evt => {
    this.setState({
      values: {...this.state.values, password1: evt.target.value}
    });
  };

  handlePassword2Change = evt => {
    this.setState({
      values: {...this.state.values, password2: evt.target.value}
    });
  };

  handleFormSubmit = evt => {
    evt.preventDefault();
    const formData = {
      email: this.state.values.email,
      password1: this.state.values.password1,
      password2: this.state.values.password2
    };
    return fetchJson('rest-auth/registration/', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then(response => {
      toast.info(<div>
          <p className="font-weight-bold">Registro exitoso</p>
          <p>¡Gracias por registrarte en SoloTodo!</p>
          <p>Te hemos enviado un correo para que puedas validar tu cuenta y así puedas empezar a usarla</p>
        </div>,
        {autoClose: false}
      );
      Router.push("/")
    }).catch(err => {
      err.json().then(errJson => {
        this.setState({
          errors: errJson
        });
      })
    })
  };

  render() {
    const emailErrors = this.state.errors.email || [];
    const password1Errors = this.state.errors.password1 || [];
    let password2Errors = this.state.errors.password2 || [];
    if (this.state.errors.non_field_errors) {
      password2Errors = password2Errors.concat(this.state.errors.non_field_errors);
    }

    return <React.Fragment>
      <Head>
        <title>Registro de usuario - SoloTodo</title>
      </Head>
      
      <div className="container">
        <div className="row">
          <TopBanner category="Any" />
          <div className="col-12">
            <h1>Registro de usuario</h1>
            <hr />
          </div>
          <div className="col-12 col-sm-6">
            <div className="content-card">
              <form onSubmit={this.handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="inputEmail">Correo electrónico</label>
                  <input type="email"
                         className={emailErrors.length ? "form-control invalid" : "form-control"}
                         id="inputEmail"
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
                  <label htmlFor="inputPassword1">Contraseña</label>
                  <input type="password"
                         className={password1Errors.length ? "form-control invalid" : "form-control"}
                         id="inputPassword1"
                         placeholder="Contraseña"
                         onChange={this.handlePassword1Change}
                         value={this.state.values.password1}
                         required
                  />
                  {
                    password1Errors.map(err => (
                      <div className="invalid-input" key={err}>
                        {err}
                      </div>
                    ))
                  }
                </div>
                <div className="form-group">
                  <label htmlFor="inputPassword2">Confirma tu contraseña</label>
                  <input type="password"
                         className={password2Errors.length ? "form-control invalid" : "form-control"}
                         id="inputPassword2"
                         placeholder="Contraseña"
                         onChange={this.handlePassword2Change}
                         value={this.state.values.password2}
                         required
                  />
                  {
                    password2Errors.map(err => (
                      <div className="invalid-input" key={err}>
                        {err}
                      </div>
                    ))
                  }
                </div>
                <input type="submit" className="btn btn-primary" value="¡Registrarse!"/>
              </form>

              <p className="mt-3">
                ¿Ya tienes una cuenta? Por favor <Link href="/account/login"><a className="text-primary">inicia sesión</a></Link>.
              </p>
              <p>
                ¿Prefieres entrar con tu cuenta de Facebook?
              </p>
              <AccountFacebookLogin />
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="content-card">
              <h2>¿De qué sirve registrarse?</h2>
              <ul>
                <li>Te permite hacer cotizaciones de PCs completos por partes</li>
              </ul>
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

export default connect(mapStateToProps)(Signup);
