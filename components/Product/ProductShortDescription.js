import React from 'react';
import {connect} from "react-redux";
import Link from 'next/link';

import {
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";

import {solotodoStateToPropsUtils} from "../../redux/utils";
import {getProductShortDescription} from "../../utils";

class ProductShortDescription extends React.Component {
  render() {
    const firstPrice = this.props.productEntry.metadata.prices_per_currency[0];
    const firstPriceCurrency = this.props.currencies.filter(currency => currency.url === firstPrice.currency)[0];

    const formattedPrice = this.props.formatCurrency(firstPrice.offer_price, firstPriceCurrency);

    const product = this.props.productEntry.product;

    return <Link href={`/products/[slug]?slug=${product.id}-${product.slug}`} as={`/products/${product.id}-${product.slug}`}>
      <a className="short-description-product d-flex flex-column">
        <div className="image-container">
          <img src={`${product.url}picture/?width=300&height=200`} alt={product.name}/>
        </div>
        <div className="name-container">
          {product.name}
        </div>
        <div className="description-container" dangerouslySetInnerHTML={{__html: this.props.productDescription}}>
        </div>
        <div className="price-container mt-auto">
          {formattedPrice}
        </div>
      </a>
    </Link>
  }
}

function mapStateToProps(state, ownProps) {
  const {currencies, formatCurrency} = solotodoStateToPropsUtils(state);

  const categoryTemplates = filterApiResourceObjectsByType(state.apiResourceObjects, 'category_templates');
  const productDescription = getProductShortDescription(ownProps.productEntry.product, categoryTemplates);

  return {
    productDescription,
    currencies,
    formatCurrency
  }
}

export default connect(mapStateToProps)(ProductShortDescription)