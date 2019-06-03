import React from 'react'
import {connect} from "react-redux";

import {fetchJson} from "../../react-utils/utils";

import {settings} from '../../settings';
import {solotodoStateToPropsUtils} from "../../redux/utils";
import ProductAxisChoices from "./ProductAxisChoices";

class ProductVariants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pricingEntries: undefined
    }
  }

  componentDidMount() {
    const bucketSettings = settings.bucketCategories[this.props.category.id];
    this.componentUpdate(this.props.preferredStores, this.props.product, bucketSettings)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.product.id !== prevProps.product.id) {
      const bucketSettings = settings.bucketCategories[this.props.category.id];
      this.componentUpdate(this.props.preferredStores, this.props.product, bucketSettings)
    }
  }

  componentUpdate = (stores, product, bucketSettings) => {
    if(!bucketSettings) {
      this.setState({
        pricingEntries: undefined
      });
      return
    }

    const fields = bucketSettings.fields;
    const bucketUrl = `products/${product.id}/bucket/?fields=${fields}`;

    fetchJson(bucketUrl).then(products => {
      let pricingEntriesUrl = `products/available_entities/?`;

      for (const product of products) {
        pricingEntriesUrl += `ids=${product.id}&`;
      }

      for (const store of stores) {
        pricingEntriesUrl += `stores=${store.id}&`
      }

      fetchJson(pricingEntriesUrl).then(response => {
        const filteredEntries = response.results.map(pricingEntry => (
            {
              product: pricingEntry.product,
              entities: pricingEntry.entities.filter(entity => entity.active_registry.cell_monthly_payment === null)
            }
        )).filter(pricingEntry => pricingEntry.entities.length || pricingEntry.product.id === product.id);
        this.setState({
          pricingEntries: filteredEntries
        })
      })
    });
  };

  render() {
    const bucketSettings = settings.bucketCategories[this.props.category.id];

    if (!bucketSettings || !this.state.pricingEntries) {
      return null
    }

    const axes = bucketSettings.axes;

    const labelFields = axes.map(axis => axis.labelField);

    return <div className={this.props.className}>
      <div className="content-card">
        {axes.map(axis => <ProductAxisChoices
          key={axis.label}
          axis={axis}
          product={this.props.product}
          pricingEntries={this.state.pricingEntries}
          otherLabelFields={labelFields.filter(labelField => labelField !== axis.labelField)}
        />)}
      </div>
    </div>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores} = solotodoStateToPropsUtils(state);

  return {
    preferredStores: preferredCountryStores
  }
}

export default connect(mapStateToProps)(ProductVariants)