import React from 'react'
import {connect} from "react-redux";

import {settings} from "../settings";
import LeadLink from "../react-utils/components/LeadLink";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";


class SoloTodoLeadLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      couponModalOpen: false
    }
  }

  toggleCouponModalOpen = () => {
    this.setState({
      couponModalOpen: !this.state.couponModalOpen
    })
  }

  handleClick = (uuid, evt) => {
    const {entity, product, storeEntry, category} = this.props;

    if (entity.best_coupon && !this.state.couponModalOpen) {
      evt.preventDefault();
      this.toggleCouponModalOpen()
    } else {
      const price = parseFloat(entity.active_registry.offer_price);

      window.gtag('event', 'Follow', {
        dimension2: category.name,
        dimension3: product.name,
        dimension4: storeEntry.name,
        dimension5: `${product.name}|${category.name}|${storeEntry.name}`,
        event_category: 'Lead',
        event_label: uuid,
        value: price
      });
    }

  };

  render() {
    const {entity, className, storeEntry, children} = this.props;
    return <><LeadLink
        entity={entity}
        store={storeEntry}
        className={className}
        websiteId={settings.websiteId}
        callback={this.handleClick}
        soicosPrefix="ST_"
    >
      {children}
    </LeadLink>
      <Modal isOpen={this.state.couponModalOpen} toggle={this.toggleCouponModalOpen}>
        <ModalHeader toggle={this.toggleCouponModalOpen}>¡Producto con cupón!</ModalHeader>
        <ModalBody>
          <p>
          Para hacer válido este precio usa el siguiente cupón en el carrito de compras de la tienda:
          </p>

          <h2>{ entity.best_coupon && entity.best_coupon.code }</h2>
        </ModalBody>
        <ModalFooter>
          <LeadLink
              entity={entity}
              store={storeEntry}
              className={className}
              websiteId={settings.websiteId}
              callback={this.handleClick}
              soicosPrefix="ST_"
          >
          <Button color="primary">¡Entendido! Llévame a la página de la tienda</Button>
          </LeadLink>
          <Button color="danger" onClick={this.toggleCouponModalOpen}>Cerrar</Button>
        </ModalFooter>
      </Modal>
    </>
  }
}

function mapStateToProps(state, ownProps) {
  return {
    category: state.apiResourceObjects[ownProps.entity.category],
  }
}

export default connect(mapStateToProps)(SoloTodoLeadLink)