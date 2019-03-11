import React, {Component} from 'react';
import {connect} from "react-redux";
import {solotodoStateToPropsUtils} from "../redux-utils";
import {Link, Redirect} from "react-router-dom";
import {toast} from 'react-toastify';
import {fetchJson} from '../react-utils/utils'
import {addApiResourceStateToPropsUtils} from "../react-utils/ApiResource";
import {setTitle} from "../utils";
import AccountFacebookLogin from "./AccountFacebookLogin";
import TopBanner from "../TopBanner";

class AccountSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        email: '',
        password1: '',
        password2: ''
      },
      errors: {},
      signUpSuccessful: false
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
    let formData = {
      email: this.state.values.email,
      password1: this.state.values.password1,
      password2: this.state.values.password2
    };
    return fetchJson('rest-auth/registration/', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then((response) => {
      toast.info(<div>
            <p className="font-weight-bold">Registro exitoso</p>
            <p>¡Gracias por registrarte en SoloTodo!</p>
            <p>Te hemos enviado un correo para que puedas validar tu cuenta y así puedas empezar a usarla</p>
          </div>,
          {autoClose: false}
      );
      this.setState({
        signUpSuccessful: !this.state.signUpSuccessful
      })
    }).catch(err => {
      err.json().then(errJson => {
        this.setState({
          errors: errJson
        });
      })
    })
  };

  render() {
    setTitle("Registro de usuario");

    if (this.props.user) {
      return <Redirect to="/"/>
    }

    if (this.state.signUpSuccessful) {
      return <Redirect to="/"/>
    }

    const emailErrors = this.state.errors.email || [];
    const password1Errors = this.state.errors.password1 || [];
    let password2Errors = this.state.errors.password2 || [];
    if (this.state.errors.non_field_errors) {
      password2Errors = password2Errors.concat(this.state.errors.non_field_errors);
    }

    return <div className="row">
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
            ¿Ya tienes una cuenta? Por favor <Link to="/account/login" className="text-primary">inicia sesión</Link>.
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
            <li>(Proximamente!) Suscribirte a los cambios de precio de los productos que te interesan</li>
          </ul>
        </div>
      </div>
    </div>
  }
}

export default connect(
    addApiResourceStateToPropsUtils(solotodoStateToPropsUtils)
)(AccountSignup);
