import React from 'react'
import Router, {withRouter} from 'next/router'
import {toast} from "react-toastify";

import {fetchJson} from "../../react-utils/utils";

import {settings} from "../../settings";

class AlertDeleteByKey extends React.Component {
  static async getInitialProps(ctx) {
    const {query} = ctx;

    const alertKey = query.key;

    return {
      alertKey
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      done: false
    }
  }

  componentDidMount() {
    const alertKey = this.props.alertKey;

    if (!alertKey) {
      toast.error('Error: Llave no encontrada');
      this.setState({
        done: true
      });
      return
    }
    const payload = {
      payload: alertKey
    };

    fetchJson(`${settings.apiResourceEndpoints.anonymous_alerts}delete_by_key/`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }).then(res => res.json).then(res => {
      toast.success('¡Alerta eliminada exitosamente!',
        {autoClose: false});
      this.setState({
        done: true
      })
    }).catch(err => {
      toast.error('Error: Llave inválida. Puede que esta alerta ya haya sido borrada. Si el problema persiste por favor contáctanos!',
        {autoClose: false});
      this.setState({
        done: true
      })
    })
  }

  render() {
    if (this.state.done) {
      Router.push('/', '/')
    }

    return <div className="row mt-3">
      <div className="col-12">
        Por favor espera un momento...
      </div>
    </div>
  }
}

export default withRouter(AlertDeleteByKey)
