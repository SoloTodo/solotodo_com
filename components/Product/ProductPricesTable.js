import React from 'react'
import {connect} from "react-redux";

import {fetchJson} from "../../react-utils/utils";
import {listToObject} from "../../react-utils/utils";

import {settings} from "../../settings";
import {solotodoStateToPropsUtils} from "../../redux/utils";
import ProductNormalPricesTable from "./ProductNormalPricesTable";
import ProductCellPricesTable from "./ProductCellPricesTable";

class ProductPricesTable extends React.Component {
  static async getInitialProps(preferredCountryStores, entities) {
    // Get Stores
    const storeUrls = entities.map(entity => entity.store);
    const filteredStores = preferredCountryStores.filter(store => storeUrls.includes(store.url));
    const storeEntries = listToObject(filteredStores, 'url');

    // Get StoresRating
    let storesRatingsUrl = '';
    for (const store of filteredStores) {
      storesRatingsUrl += 'ids=' + store.id + '&';
    }
    const storesRatings = await fetchJson(`${settings.apiResourceEndpoints.stores}average_ratings?${storesRatingsUrl}`);
    for (const storeRating of storesRatings) {
      storeEntries[storeRating.store].rating = storeRating.rating;
    }

    return {
      storeEntries
    }
  }

  render() {
    const PricesTableComponent = this.props.category.id === settings.cellPhoneCategoryId?
      ProductCellPricesTable :
      ProductNormalPricesTable;

    return <PricesTableComponent
      entities={this.props.entities}
      storeEntries={this.props.storeEntries}
      preferredCurrency={this.props.preferredCurrency}
      numberFormat={this.props.numberFormat}
    />
  }
}

function mapStateToProps(state) {
  const {preferredCurrency, numberFormat} = solotodoStateToPropsUtils(state);

  return {
    preferredCurrency,
    numberFormat
  }
}


export default connect(mapStateToProps)(ProductPricesTable);