import React from 'react'
import Link from "next/link";
import uniqBy from 'lodash/uniqBy'
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.product.id !== prevProps.product.id) {
      this.setState({
        otherVariantsModalIsActive: false
      })
    }
  }

  render() {
    const labelAndOrderingValues = this.props.pricingEntries.map(pricingEntry => ({
      labelValue: pricingEntry.product.specs[this.props.axis.labelField],
      orderingValue: pricingEntry.product.specs[this.props.axis.orderingField]
    }));

    const uniqueLabelAndOrderingValues = uniqBy(labelAndOrderingValues, 'labelValue')
      .sort(function(productTuple1, productTuple2){
        const value1 = productTuple1.orderingValue;
        const value2 = productTuple2.orderingValue;
        if (value1 < value2) {
          return -1;
        } else if (value2 > value1) {
          return 1;
        } else {
          return 0;
        }
      });

    const axesChoices = uniqueLabelAndOrderingValues.map(uniqueLabelAndOrderingValue => {
      const matchingAxisPricingEntries = this.props.pricingEntries.filter(pricingEntry => (
        pricingEntry.product.specs[this.props.axis.labelField] === uniqueLabelAndOrderingValue.labelValue
      ));

      const originalProductMatches = this.props.product.specs[this.props.axis.labelField] === uniqueLabelAndOrderingValue.labelValue;

      const matchingAxisPricingEntry = matchingAxisPricingEntries.filter(pricingEntry => (
        this.props.otherLabelFields.every(labelField => pricingEntry.product.specs[labelField] === this.props.product.specs[labelField])
      ))[0] || null;

      const redirectUrlData = matchingAxisPricingEntry && {
        id: matchingAxisPricingEntry.product.id,
        slug: matchingAxisPricingEntry.product.slug
      };

      return {
        ...uniqueLabelAndOrderingValue,
        matchingAxisPricingEntries,
        originalProductMatches,
        redirectUrlData
      }
    });

    const axis = this.props.axis;

    return <div className="d-flex align-items-center axis-label-and-choices">
      <h4 className="mb-0">{axis.label}</h4>
      <div className="d-flex flex-wrap axis-choices ml-3">
        {axesChoices.map(choice => {
          if (choice.originalProductMatches) {
            return <button type="button" className="btn btn-secondary active btn-sm" key={choice.labelValue}>{choice.labelValue}</button>
          } else if (choice.redirectUrlData) {
            return <Link
              key={choice.labelValue}
              href={`/products/view?id=${choice.redirectUrlData.id}&slug=${choice.redirectUrlData.slug}`}
              as={`/products/${choice.redirectUrlData.id}-${choice.redirectUrlData.slug}`}>
              <button type="button" className="btn btn-outline-secondary btn-sm">{choice.labelValue}</button>
            </Link>
          } else {
            return <div key={choice.labelValue}>
              <button type="button" className="btn btn-outline-secondary btn-sm" key={choice.labelValue} onClick={this.otherVariantsModalToggle}>
                {choice.labelValue}
              </button>
              <Modal id="variants-modal" isOpen={this.state.otherVariantsModalIsActive} toggle={this.otherVariantsModalToggle}>
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
                            href={`/products/view?id=${pricingEntry.product.id}&slug=${pricingEntry.product.slug}`}
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
        })}
      </div>
    </div>
  }
}

export default AxisChoices