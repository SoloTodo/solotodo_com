import React from 'react'
import {connect} from "react-redux";

import {fetchJson} from "../../react-utils/utils";
import {listToObject} from "../../react-utils/utils";

import {settings} from "../../settings";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import ProductNormalPricesTable from "./ProductNormalPricesTable";
import ProductCellPricesTable from "./ProductCellPricesTable";

class ProductPricesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storeEntries: undefined
    }
  }

  componentDidUpdate() {
    if (!this.props.entities) {
      return
    }

    // Get Stores
    const storeUrls = this.props.entities.map(entity => entity.store);
    const filteredStores = this.props.preferredCountryStores.filter(store => storeUrls.includes(store.url));
    const storeEntries = listToObject(filteredStores, 'url');

    if (!storeUrls.length) {
      return
    }

    // Get StoresRating
    let storesRatingsUrl = '';
    for (const store of filteredStores) {
      storesRatingsUrl += 'ids=' + store.id + '&';
    }

    fetchJson(`${settings.apiResourceEndpoints.stores}average_ratings/?${storesRatingsUrl}`).then(storesRatings => {
      for (const storeRating of storesRatings) {
        storeEntries[storeRating.store].rating = storeRating.rating;
      }
      this.setState({
        storeEntries
      })
    });
  }

  render() {
    if (!this.props.entities || !this.state.storeEntries) {
      return null
    }
    const PricesTableComponent = this.props.category.id === settings.cellPhoneCategoryId?
      ProductCellPricesTable :
      ProductNormalPricesTable;

    return <PricesTableComponent
      entities={this.props.entities}
      storeEntries={this.state.storeEntries}
      preferredCurrency={this.props.preferredCurrency}
      numberFormat={this.props.numberFormat}
    />
  }
}

function mapStateToProps(state) {
  const {preferredCurrency, preferredCountryStores, numberFormat} = solotodoStateToPropsUtils(state);

  return {
    preferredCurrency,
    preferredCountryStores,
    numberFormat
  }
}


export default connect(mapStateToProps)(ProductPricesTable);