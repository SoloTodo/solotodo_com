import React from 'react'
import {connect} from "react-redux";

import Big from 'big.js';

import {
  areObjectsEqual,
  areValueListsEqual,
  fetchJson
} from "../../react-utils/utils";
import {listToObject} from "../../react-utils/utils";

import {settings} from "../../settings";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import ProductNormalPricesTable from "./ProductNormalPricesTable";
import ProductCellPricesTable from "./ProductCellPricesTable";
import {calculatePriceWithCoupon} from "../../utils";

class ProductPricesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: undefined,
      storeEntries: undefined
    }
  }

  componentDidMount() {
    this.componentUpdate(this.props.product)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.product.id !== this.props.product.id ||
      !areValueListsEqual(prevProps.preferredCountryStores, this.props.preferredCountryStores) ||
      !areObjectsEqual(prevProps.preferredCountry, this.props.preferredCountry) ||
      prevProps.preferredExcludeRefurbished !== this.props.preferredExcludeRefurbished) {
      this.componentUpdate(this.props.product)
    }
  }

  componentUpdate(product){
    const productsUrl = settings.apiResourceEndpoints.products;
    let storesUrl = '';

    for (let store of this.props.preferredCountryStores) {
      storesUrl += `&stores=${store.id}`
    }

    fetchJson(`${productsUrl}available_entities/?ids=${product.id}${storesUrl}&exclude_refurbished=${this.props.preferredExcludeRefurbished || this.props.excludeRefurbished}`).then(availableEntities => {
      const entities = availableEntities.results[0].entities.filter(entity => entity.active_registry.cell_monthly_payment === null);
      this.props.onEntitiesChange(entities);

      const storeUrls = entities.map(entity => entity.store);
      const filteredStores = this.props.preferredCountryStores.filter(store => storeUrls.includes(store.url));
      const storeEntries = listToObject(filteredStores, 'url');

      if (!storeUrls.length || !this.props.preferredCountryStores.length) {
        this.setState({
          entities: [],
          storeEntries: []
        });
        return
      }

      let storesRatingsUrl = '';
      for (const store of filteredStores) {
        storesRatingsUrl += 'ids=' + store.id + '&';
      }

      fetchJson(`${settings.apiResourceEndpoints.stores}average_ratings/?${storesRatingsUrl}`).then(storesRatings => {
        for (const storeRating of storesRatings) {
          storeEntries[storeRating.store].rating = storeRating.rating;
        }
        this.setState({
          entities,
          storeEntries
        })
      });
    })
  }

  render() {
    if (!this.state.entities || !this.state.storeEntries) {
      return null
    }

    const PricesTableComponent = this.props.category.id === settings.cellPhoneCategoryId?
      ProductCellPricesTable :
      ProductNormalPricesTable;

    const entities = [...this.state.entities]

    entities.sort((a, b) => {
      const aPrice = a.best_coupon ? calculatePriceWithCoupon(a.best_coupon.amount, a.best_coupon.amount_type, a.active_registry.offer_price) : new Big(a.active_registry.offer_price)
      const bPrice = b.best_coupon ? calculatePriceWithCoupon(b.best_coupon.amount, b.best_coupon.amount_type, b.active_registry.offer_price) : new Big(b.active_registry.offer_price)
      return aPrice - bPrice
    })

    return <PricesTableComponent
      entities={entities}
      storeEntries={this.state.storeEntries}
      formatCurrency={this.props.formatCurrency}
      entityHighlight={this.props.entityHighlight}
      hideRatings={this.props.hideRatings}/>
  }
}

function mapStateToProps(state) {
  const {preferredCountry, preferredCountryStores, preferredExcludeRefurbished, formatCurrency} = solotodoStateToPropsUtils(state);

  return {
    preferredCountry,
    preferredCountryStores,
    preferredExcludeRefurbished,
    formatCurrency
  }
}


export default connect(mapStateToProps)(ProductPricesTable);