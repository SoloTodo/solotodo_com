import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import {toast} from 'react-toastify';
import { fetchJson } from "../react-utils/utils";
import TopBanner from "../components/TopBanner";


class PasswordResetConfirm extends React.Component {
  static getInitialProps ({ query }) {
    return {
      uid: query.uid,
      token: query.token
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      values: {
        new_password1: '',
        new_password2: ''
      },
      errors: {}
    }
  }

  handlePassword1Change = evt => {
    this.setState({
      values: {...this.state.values, new_password1: evt.target.value}
    });
  };

  handlePassword2Change = evt => {
    this.setState({
      values: {...this.state.values, new_password2: evt.target.value}
    });
  };

  handleFormSubmit = evt => {
    evt.preventDefault();

    let formData = {
      ...this.state.values,
      uid: this.props.uid,
      token: this.props.token
    };

    return fetchJson('rest-auth/password/reset/confirm/', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then(response => {
      toast.info('Cambio exitoso. Ahora puedes iniciar sesión con tu nueva contraseña', {autoClose: false});
      Router.push('/account/login');
    }).catch(err => {
      err.json().then(errJson => {
        const credentialErrors = errJson['token'] || errJson['uid'] || [];

        if (credentialErrors.length) {
          toast.error('Link de reinicio de contraseña inválido', {autoClose: false});
          Router.push('/');
        }
        this.setState({
          errors: errJson
        })
      });
    })
  };

  render() {
    const new_password1Errors = this.state.errors.new_password1 || [];
    const new_password2Errors = this.state.errors.new_password2 || [];

    return <React.Fragment>
      <Head>
        <title>Cambio de contraseña - SoloTodo</title>
      </Head>

      <div className="container">
        <div className="row">
          <TopBanner category="Any" />
          <div className="col-12">
            <h1>Cambio de contraseña</h1>
            <hr />
          </div>
          <div className="col-12 col-sm-6">
            <div className="content-card">
              <form onSubmit={this.handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="inputPassword1">Nueva contraseña</label>
                  <input type="password"
                         className={new_password1Errors.length ? "form-control invalid" : "form-control"}
                         id="inputPassword1"
                         placeholder="Contraseña"
                         onChange={this.handlePassword1Change}
                         value={this.state.values.new_password1}
                         required
                  />
                  {
                    new_password1Errors.map(err => (
                      <div className="invalid-input" key={err}>
                        {err}
                      </div>
                    ))
                  }
                </div>
                <div className="form-group">
                  <label htmlFor="inputPassword2">Confirma tu contraseña</label>
                  <input type="password"
                         className={new_password2Errors.length ? "form-control invalid" : "form-control"}
                         id="inputPassword2"
                         placeholder="Contraseña"
                         onChange={this.handlePassword2Change}
                         value={this.state.values.new_password2}
                         required
                  />
                  {
                    new_password2Errors.map(err => (
                      <div className="invalid-input" key={err}>
                        {err}
                      </div>
                    ))
                  }
                </div>
                <input type="submit" className="btn btn-primary" value="Enviar"/>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

export default PasswordResetConfirm;
