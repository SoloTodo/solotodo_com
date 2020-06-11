import React from 'react'
import Link from "next/link";
import {Modal, ModalHeader, ModalBody} from "reactstrap";

class AxisChoices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otherVariantsModalIsActive: false
    }
  }

  otherVariantsModalToggle = () => {
    this.setState({
      otherVariantsModalIsActive: !this.state.otherVariantsModalIsActive
    })
  };

  render() {
    const choice = this.props.choice;
    const axis = this.props.axis;
    return <div>
      <button type="button" className="btn btn-outline-secondary btn-sm" key={choice.labelValue} onClick={this.otherVariantsModalToggle}>
        {choice.labelValue}
      </button>
      <Modal isOpen={this.state.otherVariantsModalIsActive} toggle={this.otherVariantsModalToggle}>
        <ModalHeader toggle={this.otherVariantsModalToggle}>
          Producto exacto no disponible
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-12">
              <p>Te mostramos variantes en {axis.label} {choice.labelValue} que
                sí están disponibles para compra:</p>
              {choice.matchingAxisPricingEntries.map(pricingEntry => (
                <p key={pricingEntry.product.id}>
                  <Link
                    href={`/products/[slug]?slug=${pricingEntry.product.id}-${pricingEntry.product.slug}`}
                    as={`/products/${pricingEntry.product.id}-${pricingEntry.product.slug}`}>
                    <a>{pricingEntry.product.name}</a>
                  </Link>
                </p>
              ))}
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>

  }
}

export default AxisChoices