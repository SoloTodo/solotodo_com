import React from 'react'
import ReactTooltip from 'react-tooltip'
import ProductRatingStars from "./ProductRatingStars";

import EntityRefurbishedWarning from "../../react-utils/components/Entity/EntityRefurbishedWarning";

import SoloTodoLeadLink from '../SoloTodoLeadLink'

class ProductNormalPricesTable extends React.Component {
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
            <SoloTodoLeadLink
              className="normal-table-product-link"
              entity={entity}
              storeEntry={storeEntry}
              product={entity.product}>
              {storeEntry.name}
            </SoloTodoLeadLink>
            <EntityRefurbishedWarning entity={entity}/>
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
              {this.props.formatCurrency(entity.active_registry.offer_price)}
            </SoloTodoLeadLink>
          </td>
          <td className="text-right">
            <SoloTodoLeadLink
              className="price-container"
              entity={entity}
              storeEntry={storeEntry}
              product={entity.product}>
              {this.props.formatCurrency(entity.active_registry.normal_price)}
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

export default ProductNormalPricesTable;