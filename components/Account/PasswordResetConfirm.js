import React, {Component} from 'react';
import {connect} from "react-redux";
import {
  apiResourceStateToPropsUtils
} from "../react-utils/ApiResource";
import {toast} from 'react-toastify';
import {Redirect} from "react-router-dom";
import {setTitle, withSoloTodoTracker} from "../utils";
import TopBanner from "../TopBanner";

class PasswordResetConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        uid: undefined,
        token: undefined,
        new_password1: '',
        new_password2: ''
      },
      errors: {},
      petitionResponse: undefined
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

    let formData = {...this.state.values};

    return this.props.fetchAuth('rest-auth/password/reset/confirm/', {
      method: 'POST',
      body: JSON.stringify(formData)
    }).then(response => {
      toast.info('Cambio exitoso. Ahora puedes iniciar sesión con tu nueva contraseña', {autoClose: false});
      this.setState({
        petitionResponse: response
      })
    }).catch(err => {
      err.json().then(errJson => {
        const credentialErrors = errJson['token'] || errJson['uid'] || [];

        if (credentialErrors.length) {
          toast.error('Link de reinicio de contraseña inválido', {autoClose: false});
          this.setState({
            petitionResponse: {detail: 'Link de reinicio de contraseña inválido'}
          });
        }
        this.setState({
          errors: errJson
        })
      });
    })
  };

  componentDidMount() {
    const url = window.location.pathname;
    const parsedUrl = url.match('reset/(.+)/(.+)/$');

    this.setState({
      values: {...this.state.values, uid: parsedUrl[1], token: parsedUrl[2]}
    });
  }

  render() {
    const new_password1Errors = this.state.errors.new_password1 || [];
    const new_password2Errors = this.state.errors.new_password2 || [];

    setTitle("Cambio de contraseña");

    if (this.state.petitionResponse) {
      return <Redirect to="/account/login"/>
    }

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
  }
}

function mapStateToProps(state) {
  const {fetchAuth} = apiResourceStateToPropsUtils(state);

  return {
    fetchAuth
  }
}

function mapPropsToGAField(props) {
  return {
    pageTitle: 'Cambio de contraseña'
  }
}

export default withSoloTodoTracker(connect(mapStateToProps)(PasswordResetConfirm), mapPropsToGAField);