import React from 'react'
import Link from "next/link";
import uniqBy from 'lodash/uniqBy'

import ProductAxisChoicesButton from './ProductAxisChoicesButton'

class AxisChoices extends React.Component {
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
              href={`/products/[slug]?slug=${choice.redirectUrlData.id}-${choice.redirectUrlData.slug}`}
              as={`/products/${choice.redirectUrlData.id}-${choice.redirectUrlData.slug}`}>
              <button type="button" className="btn btn-outline-secondary btn-sm">{choice.labelValue}</button>
            </Link>
          } else {
            return <ProductAxisChoicesButton
              key={choice.labelValue}
              choice={choice}
              axis={axis}/>
          }
        })}
      </div>
    </div>
  }
}

export default AxisChoices