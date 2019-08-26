import React from 'react';
import {connect} from "react-redux";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {toast} from 'react-toastify'

import {fetchJson} from "../../react-utils/utils";

import {solotodoStateToPropsUtils} from "../../redux/utils";
import {settings} from '../../settings'

class ProductAlertButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      email: ''
    }
  }

  handleButtonClick = evt => {
    evt.preventDefault();
    const email = this.props.user ? this.props.user.email : '';
    this.setState({
      isModalOpen: true,
      email
    })
  };

  toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    })
  };

  handleEmailChange = evt => {
    this.setState({
      email: evt.target.value
    })
  };

  handleFormSubmit = evt => {
    evt.preventDefault();
    const payload = {
      email: this.state.email,
      product: this.props.product.id,
      stores: this.props.preferredCountryStores.map(store => store.id)
    };

    fetchJson(settings.apiResourceEndpoints.alerts, {
      method: 'POST',
      body: JSON.stringify(payload)
    }).then(() => {
      toast.success('¡Alerta creada exitosamente!', {
        autoClose: false
      });

      this.setState({
        isModalOpen: false
      })
    }).catch(async err => {
      const errors = await err.json();
      if (errors.non_field_errors) {
        toast.info('¡El correo ya está suscrito a este producto!', {
          autoClose: false
        });
      } else {
        toast.error('Error al crear alerta', {
          autoClose: false
        });
      }
      this.setState({
        isModalOpen: false
      })
    });

    return false;
  };

  render() {
    const label = this.props.entity ?
      '¡Avísame cuando baje de precio!' :
      '¡Avísame cuando vuelva a estar disponible!';

    return <div className="mt-2 ml-2">
      <button type="button" className="btn btn-success" onClick={this.handleButtonClick}>{label}</button>

      <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} className={this.props.className}>
        <form method="post" action="." onSubmit={this.handleFormSubmit}>
          <ModalHeader toggle={this.toggleModal}>Alertas de cambios de precio</ModalHeader>
          <ModalBody>
            Ingresa tu correo y te notificaremos cuando este producto cambie de precio o disponibilidad.
            <input type="email" className="form-control mt-3" placeholder="Ingresa tu correo" value={this.state.email} onChange={this.handleEmailChange} required={true} />
          </ModalBody>
          <ModalFooter>
            <button type="submit" className="btn btn-success">Suscribirse</button>
            <Button color="danger" onClick={this.toggleModal}>Cancelar</Button>
          </ModalFooter>
        </form>
      </Modal>

    </div>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores, user} = solotodoStateToPropsUtils(state);
  return {
    preferredCountryStores,
    user
  }
}

export default connect(mapStateToProps)(ProductAlertButton)
