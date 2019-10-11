import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import {fetchJson} from '../../react-utils/utils'
import {toast} from 'react-toastify';
import TopBanner from "../../components/TopBanner";


class PasswordResetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errors: {},
    }
  }

  handleEmailChange = evt => {
    this.setState({
      email: evt.target.value
    });
  };

  handleFormSubmit = evt => {
    evt.preventDefault();

    const formData = {
      email: this.state.email,
    };

    return fetchJson('rest-auth/password/reset/', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then(response => {
      toast.info('Te hemos enviado un correo con las instrucciones para resetear tu contraseña', {autoClose: false});
      Router.push('/')
    }).catch(err => {
      err.json().then(errJson => {
        this.setState({
          errors: errJson
        });
      });
    })
  };

  render() {
    const emailErrors = this.state.errors.email || [];

    return <React.Fragment>
      <Head>
        <title>Restablecer contraseña - SoloTodo</title>
      </Head>

      <div className="container">
        <div className="row">

          <TopBanner category="Any" />
          <div className="col-12">
            <h1>Restablecer Contraseña</h1>
            <hr />
          </div>
          <div className="col-12">
            <div className="content-card">
              <form onSubmit={this.handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Ingresa la dirección de correo electrónico con la que te registraste en
                    SoloTodo</label>
                  <input type="email"
                         className={emailErrors.length ? "form-control invalid col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3" : "form-control col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3"}
                         id="exampleInputEmail1"
                         placeholder="Correo electrónico"
                         onChange={this.handleEmailChange}
                         value={this.state.email}
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
                <input type="submit" className="btn btn-primary" value="Enviar Correo"/>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}

export default (PasswordResetForm);
