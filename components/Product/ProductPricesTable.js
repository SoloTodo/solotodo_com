import React from 'react'
import ReactTooltip from 'react-tooltip'
import ProductRatingStars from "./ProductRatingStars";
import {fetchJson} from "../../react-utils/utils";
import {settings} from "../../settings";
import {listToObject} from "../../react-utils/utils";
import {formatCurrency} from "../../react-utils/next_utils";
import SoloTodoLeadLink from '../SoloTodoLeadLink'

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
    return <table className="table table-sm mb-0">
      <thead>
      <tr>
        <th scope="col">Tienda</th>
        <th scope="col">Rating</th>
        <th scope="col" className="text-right">
          <ReactTooltip id="offer-price" type="info" effect="solid" place="top">
            <span>Con el medio de pago preferido de la tienda</span>
          </ReactTooltip>
          <span data-tip data-for="offer-price" className="tooltip-span">
              P. oferta
            </span>
        </th>
        <th scope="col" className="text-right">
          <ReactTooltip id="normal-price" type="info" effect="solid" place="top">
            <span>Con cualquier medio de pago</span>
          </ReactTooltip>
          <span data-tip data-for="normal-price" className="tooltip-span">
              P. normal
            </span>
        </th>
      </tr>
      </thead>
      <tbody>
      {this.props.entities.length? this.props.entities.map(entity => {
        const storeEntry = this.props.storeEntries[entity.store];
        return <tr key={entity.id}>
          <td>
            {storeEntry.name}
          </td>
          <td>
            <ProductRatingStars
              value={storeEntry.rating}
              linkHref={`/store_ratings?id=${storeEntry.id}`}
              linkAs={`/stores/${storeEntry.id}/ratings`}/>
          </td>
          <td className="text-right">
            <SoloTodoLeadLink
              className="price-container"
              entity={entity}
              storeEntry={storeEntry}
              product={entity.product}>
              {formatCurrency(
                entity.active_registry.offer_price,
                this.props.preferredCurrency,
                this.props.preferredCurrency,
                this.props.numberFormat.thousands_separator,
                this.props.numberFormat.decimal_separator)}
            </SoloTodoLeadLink>
          </td>
          <td className="text-right">
            <SoloTodoLeadLink
              className="price-container"
              entity={entity}
              storeEntry={storeEntry}
              product={entity.product}>
              {formatCurrency(
                entity.active_registry.normal_price,
                this.props.preferredCurrency,
                this.props.preferredCurrency,
                this.props.numberFormat.thousands_separator,
                this.props.numberFormat.decimal_separator)}
            </SoloTodoLeadLink>
          </td>
        </tr>
        }) :
        <tr>
          <td colSpan="4">Este producto no está disponible actualmente</td>
        </tr>
      }
      </tbody>
    </table>
  }
}

export default ProductPricesTable