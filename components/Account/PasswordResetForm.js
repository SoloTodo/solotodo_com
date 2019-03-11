import React, {Component} from 'react';
import {connect} from "react-redux";
import {addApiResourceStateToPropsUtils} from "../react-utils/ApiResource";
import {fetchJson} from '../react-utils/utils'
import {toast} from 'react-toastify';
import {Redirect} from "react-router-dom";
import {setTitle} from "../utils";
import TopBanner from "../TopBanner";

class PasswordResetForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errors: {},
      petitionResponse: undefined

    }
  }

  handleEmailChange = evt => {
    this.setState({
      email: evt.target.value
    });
  };

  handleFormSubmit = evt => {
    evt.preventDefault();

    let formData = {
      email: this.state.email,
    };

    return fetchJson('rest-auth/password/reset/', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then(response => {
      toast.info('Te hemos enviado un correo con las instrucciones para resetear tu contraseña', {autoClose: false});
      this.setState({
        petitionResponse: response
      })
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
    setTitle("Restablecer contraseña");

    if (this.state.petitionResponse) {
      return <Redirect to="/"/>
    }
    return <div className="row">
      <TopBanner category="Any" />
      <div className="col-12">
        <h1>Recuperar Contraseña</h1>
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
  }
}

export default connect(
  addApiResourceStateToPropsUtils()
)(PasswordResetForm);