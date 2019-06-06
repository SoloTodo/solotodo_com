import React from 'react';
import {connect} from "react-redux";
import Link from 'next/link';
import Handlebars from "handlebars/dist/handlebars.min";
import {
  apiResourceStateToPropsUtils,
  filterApiResourceObjectsByType
} from "../../react-utils/ApiResource";
import {settings} from "../../settings";
import {convertIdToUrl, formatCurrency} from '../../react-utils/utils';
import {solotodoStateToPropsUtils} from "../../redux/utils";

class ProductShortDescription extends React.Component {
  formatShortDescription = () => {
    let html = '';
    if (this.props.template) {
      html = this.props.template(this.props.productEntry.product.specs)
    }

    return {__html: html}
  };

  render() {
    const countryLocale = this.props.ApiResourceObject(this.props.preferredCountry);
    const numberFormat = countryLocale.numberFormat;

    const firstPrice = this.props.ApiResourceObject(this.props.productEntry.prices[0]);

    const formattedPrice = formatCurrency(
      firstPrice.minOfferPrice, firstPrice.currency,
      countryLocale.currency, numberFormat.thousandsSeparator,
      numberFormat.decimalSeparator);

    const product = this.props.productEntry.product;

    return <Link href={`/products?id=${product.id}&slug=${product.slug}`} as={`/products/${product.id}-${product.slug}`}>
      <a className="short-description-product d-flex flex-column">
        <div className="image-container">
          <img src={`${product.url}picture/?width=300&height=200`} alt={product.name}/>
        </div>
        <div className="name-container">
          {product.name}
        </div>
        <div className="description-container" dangerouslySetInnerHTML={this.formatShortDescription()}></div>
        <div className="price-container mt-auto">
          {formattedPrice}
        </div>
      </a>
    </Link>
  }
}


function mapStateToProps(state, ownProps) {
  const {ApiResourceObject} = apiResourceStateToPropsUtils(state);
  const {preferredCountry} = solotodoStateToPropsUtils(state);

  const categoryTemplates = filterApiResourceObjectsByType(state.apiResourceObjects, 'category_templates');
  const templateWebsiteUrl = convertIdToUrl(settings.websiteId, 'websites');

  let template = categoryTemplates.filter(categoryTemplate => {
    return categoryTemplate.category === ownProps.productEntry.product.category &&
      categoryTemplate.purpose === settings.shortDescriptionPurposeUrl &&
      categoryTemplate.website === templateWebsiteUrl
  })[0] || null;

  if (template) {
    template = Handlebars.compile(template.body);
  }

  return {
    ApiResourceObject,
    template,
    preferredCountry
  }
}

export default connect(mapStateToProps)(ProductShortDescription)