import React, {Component} from 'react';
import {connect} from "react-redux";
import {addApiResourceStateToPropsUtils} from "../react-utils/ApiResource";
import {toast} from 'react-toastify';
import {Redirect} from "react-router-dom";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import {setTitle} from "../utils";
import TopBanner from "../TopBanner";

class PasswordChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        old_password: '',
        new_password1: '',
        new_password2: ''
      },
      errors: {},
      petitionResponse: undefined
    }
  }

  handleOldPasswordChange = evt => {
    this.setState({
      values: {...this.state.values, old_password: evt.target.value}
    });
  };

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

    const formData = {...this.state.values};

    return this.props.fetchAuth('rest-auth/password/change/', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then(response => {
      toast.info('Contraseña cambiada exitosamente', {autoClose: false});
      this.setState({
        petitionResponse: response
      })
    }).catch(err => {
      err.json().then(errJson => {
        this.setState({
          errors: errJson
        })
      })
    })
  };

  render() {
    setTitle("Cambiar contraseña");

    if (this.state.petitionResponse || !this.props.user) {
      return <Redirect to="/"/>
    }

    const old_passwordErrors = this.state.errors.old_password || [];
    const new_password1Errors = this.state.errors.new_password1 || [];
    const new_password2Errors = this.state.errors.new_password2 || [];

    return <div className="row">
      <TopBanner category="Any" />
      <div className="col-12">
        <h1>Cambio de contraseña</h1>
        <hr />
      </div>
      <div className="col-12 col-sm-6">
        <div className="content-card">
          <form onSubmit={this.handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="inputOldPassword">Contraseña actual</label>
              <input type="password"
                     className={old_passwordErrors.length ? "form-control invalid" : "form-control"}
                     id="inputOldPassword"
                     placeholder="Contraseña actual"
                     onChange={this.handleOldPasswordChange}
                     value={this.state.values.old_password}
                     required
              />
              {
                old_passwordErrors.map(err => (
                  <div className="invalid-input" key={err}>
                    {err}
                  </div>
                ))
              }
            </div>
            <div className="form-group">
              <label htmlFor="inputPassword1">Contraseña nueva</label>
              <input type="password"
                     className={new_password1Errors.length ? "form-control invalid" : "form-control"}
                     id="inputPassword1"
                     placeholder="Contraseña nueva"
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
              <label htmlFor="inputPassword2">Confirma tu contraseña nueva</label>
              <input type="password"
                     className={new_password2Errors.length ? "form-control invalid" : "form-control"}
                     id="inputPassword2"
                     placeholder="Confirma tu contraseña nueva"
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
  }
}

export default connect(
  addApiResourceStateToPropsUtils(solotodoStateToPropsUtils),
)(PasswordChange);
