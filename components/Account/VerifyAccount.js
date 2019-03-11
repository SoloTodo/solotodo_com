import React, {Component} from 'react';
import queryString from 'query-string';
import {connect} from "react-redux";
import {solotodoStateToPropsUtils} from "../redux-utils";
import {addApiResourceStateToPropsUtils} from "../react-utils/ApiResource";
import {toast} from 'react-toastify';
import Loading from "../Loading";
import {Redirect} from "react-router-dom";
import {setTitle} from "../utils";

class VerifyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      petitionResponse: undefined
    }
  }

  componentDidMount() {
    const parameters = queryString.parse(window.location.search);

    this.props.fetchAuth('rest-auth/registration/verify-email/', {
      method: 'POST',
      body: JSON.stringify({key: parameters['key']})
    }).then(response => {
      if (response['detail'] === 'ok') {
        toast.info('Cuenta verificada, por favor ingrese con su correo y contraseña', {autoClose: false});
      }
      this.setState({
        petitionResponse: response
      })
    }).catch(err => {
      toast.error('Llave inválida, si este problema persiste por favor contáctenos', {autoClose: false});
      this.setState({
        petitionResponse: {detail: 'invalid key'}
      })
    })
  }

  render() {
    setTitle("Verificando cuenta");

    if (this.state.petitionResponse) {
      if (this.state.petitionResponse['detail'] === 'ok') {
        return <Redirect to="/account/login"/>
      } else {
        return <Redirect to="/"/>
      }
    } else {
      return <Loading />
    }
  }
}

export default connect(
  addApiResourceStateToPropsUtils(solotodoStateToPropsUtils)
)(VerifyAccount);