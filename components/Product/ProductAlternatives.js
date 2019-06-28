import React from 'react'
import {connect} from "react-redux";
import Link from "next/link";

import {
  areObjectsEqual,
  areValueListsEqual,
  fetchJson
} from "../../react-utils/utils";

import {settings} from "../../settings";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import ProductShortDescription from './ProductShortDescription'

const API_MODE = 1;
const BUTTON_MODE = 2;

class ProductAlternatives extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alternativeProductsBuckets: undefined
    }
  }

  componentDidMount() {
    this.componentUpdate(this.props.preferredCountryStores, this.props.product, this.props.category, this.props.entity)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.product.id !== prevProps.product.id ||
      !areValueListsEqual(prevProps.preferredCountryStores, this.props.preferredCountryStores) ||
      !areObjectsEqual(prevProps.preferredCountry, this.props.preferredCountry)) {
      this.componentUpdate(this.props.preferredCountryStores, this.props.product, this.props.category, this.props.entity)
    }
  }

  componentUpdate = (preferredStores, product, category, entity) => {
    const alternativesUrl = this.alternativesUrlCreator(product, category, entity, API_MODE, preferredStores);
    fetchJson(`${alternativesUrl}`).then(alternativeProducts => {
      const alternativeProductsBuckets = alternativeProducts.results.filter(bucket => bucket.product_entries[0].product.id !== product.id);
      this.setState({
        alternativeProductsBuckets
      })
    });
  };

  alternativesUrlCreator = (product, category, entity, mode, preferredStores) => {
    let url = '';

    if (entity) {
      const usdOfferPrice = parseFloat(entity.active_registry.offer_price) * 1.1 / parseFloat(this.props.apiResourceObjects[entity.currency].exchange_rate);
      url += `offer_price_usd_1=${usdOfferPrice}&`;
    }

    const parameters = settings.alternativeProductsParameters[category.id] || {};

    const ordering = parameters.ordering || `leads`;
    url += `ordering=${ordering}&`;

    for (const key in parameters.filters || []) {
      url += `${key}=${product.specs[parameters.filters[key]]}&`;
    }

    if (mode === API_MODE) {
      for (const store of preferredStores) {
        url += `stores=${store.id}&`;
      }
      return `categories/${category.id}/es_browse/?${url}&page_size=4`
    } else if (mode === BUTTON_MODE) {
      return `${url}`.replace(/_0/gi, '_start').replace(/_1/gi, '_end')
    }
  };

  render() {
    if (!this.state.alternativeProductsBuckets || !this.state.alternativeProductsBuckets.length) {
      return null
    }

    const alternativesPerSize = {
      extraSmall: 2,
      small: 2,
      medium: 2,
      large: 3,
      extraLarge: 3,
      infinity: 3,
    };

    const numberOfAlternativeProducts = alternativesPerSize[this.props.mediaType] || 2;
    const alternativesUrl = this.alternativesUrlCreator(this.props.product, this.props.category, this.props.entity, BUTTON_MODE);

    return <div id="product-detail-alternatives" className="product-detail-cell">
      <div className="content-card">
        <div className="row">
          <div className="col-12">
            <h3>Considera también</h3>
          </div>
        </div>
        <div className="row">
          {this.state.alternativeProductsBuckets.slice(0, numberOfAlternativeProducts).map(bucket => (
            <div className="col-12 col-sm-6 col-md-6 col-lg-4 pb-3" key={bucket.product_entries[0].product.id}>
              <ProductShortDescription
                productEntry={bucket.product_entries[0]}
                websiteId={settings.websiteId}
                preferredCountry={this.props.preferredCountry}/>
            </div>
          ))}
        </div>
        <div>
          <Link
            href={`/browse?category_slug=${this.props.category.slug}&${alternativesUrl}`}
            as={`/${this.props.category.slug}?${alternativesUrl}`}>
            <a className="btn btn-primary more-alternatives-button">Ver más sugerencias</a>
          </Link>
        </div>
      </div>
    </div>
  }
}

function mapStateToProps(state) {
  const {preferredCountryStores, preferredCountry} = solotodoStateToPropsUtils(state);

  return {
    preferredCountryStores,
    preferredCountry,
    mediaType: state.browser.mediaType,
    apiResourceObjects: state.apiResourceObjects
  }
}

export default connect(mapStateToProps)(ProductAlternatives)