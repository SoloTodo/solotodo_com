import React, {Component} from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'


class ProductRefurbishedWarning extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refurbishedModalIsOpen: false
    }
  }

  handleClick = evt => {
    evt.preventDefault();

    this.setState({
      refurbishedModalIsOpen: true
    })
  };

  toggleRefurbishedModal = () => {
    this.setState({
      refurbishedModalIsOpen: !this.state.refurbishedModalIsOpen
    })
  };

  render() {
    const entity = this.props.entity;

    if (entity.condition === 'https://schema.org/NewCondition') {
      return null
    }

    return <span>
      <a href={`/products/${entity.product.id}`} className="ml-2 text-warning" onClick={this.handleClick}>
        <i className="fas fa-exclamation-triangle"/>
      </a>

      <Modal isOpen={this.state.refurbishedModalIsOpen} toggle={this.toggleRefurbishedModal}>
        <ModalHeader toggle={this.toggleRefurbishedModal}>
          Producto Open Box / Reacondicionado / Usado
        </ModalHeader>
          <ModalBody>
            <p>Este producto <strong>no es 100% nuevo / sellado</strong>, lo que puede ser por alguno de estos motivos:</p>

            <ul>
              <li>El producto fue reacondicionado por el fabricante</li>
              <li>Fue manipulado en alguna medida por la tienda que lo vende</li>
              <li>Tiene su caja dañada</li>
              <li>El producto estuvo en exposición</li>
              <li>El producto fue devuelto por garantía pero sigue siendo funcional</li>
              <li>etc.</li>
            </ul>

            <p>Por favor confirme con la ficha de la tienda el estado exacto del producto que le interesa antes de comprarlo.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleRefurbishedModal}>Cerrar</Button>
          </ModalFooter>
      </Modal>
    </span>
  }
}

export default ProductRefurbishedWarning